import { useSignal } from '@vaadin/hilla-react-signals';
import { Grid } from '@vaadin/react-components/Grid.js';
import { GridColumn } from '@vaadin/react-components/GridColumn.js';
import { Button } from '@vaadin/react-components/Button.js';
import { FormLayout } from '@vaadin/react-components/FormLayout.js';
import { TextField } from '@vaadin/react-components/TextField.js';
import { TextArea } from '@vaadin/react-components/TextArea.js';
import { Select } from '@vaadin/react-components/Select.js';
import { useForm } from '@vaadin/hilla-react-form';
import { IssuesService } from 'Frontend/generated/endpoints';
import { useEffect } from 'react';
import Issue from 'Frontend/generated/com/example/application/Issue';
import IssueModel from 'Frontend/generated/com/example/application/IssueModel';
import IssueStatus from 'Frontend/generated/com/example/application/IssueStatus';
import { VoiceControl } from '../components/VoiceControl';

export default function IssuesView() {
  const issues = useSignal<Issue[]>([]);
  const selectedIssue = useSignal<Issue | null>(null);
  
  const { field, model, submit, read, clear } = useForm(IssueModel, {
    onSubmit: async (issue: Issue) => {
      const updatedIssue = await IssuesService.update(issue);
      issues.value = issues.value.map(i => 
        i.id === updatedIssue.id ? updatedIssue : i
      );
      selectedIssue.value = null;
    }
  });

  useEffect(() => {
    loadAllIssues();
  }, []);

  const loadAllIssues = async () => {
    const fetchedIssues = await IssuesService.findAll();
    issues.value = fetchedIssues;
  };

  const handleCreate = () => {
    const newIssue = {
      id: 0,
      title: '',
      description: '',
      status: 'OPEN',
      assignee: ''
    } as Issue;
    selectedIssue.value = newIssue;
    read(newIssue);
  };

  const handleDelete = async () => {
    if (selectedIssue.value) {
      await IssuesService.delete(selectedIssue.value.id);
      issues.value = issues.value.filter(i => i.id !== selectedIssue.value?.id);
      selectedIssue.value = null;
      clear();
    }
  };

  const handleFilterByAssignee = async (assignee: string) => {
    const filteredIssues = await IssuesService.findByAssignee(assignee);
    issues.value = filteredIssues;
  };

  return (
    <div className="p-m flex flex-col gap-m">
      <div className="flex gap-m items-center justify-between">
        <div className="flex gap-m items-center">
          <h2 className="m-0">Issues</h2>
          <Button theme="primary" onClick={handleCreate}>Create New</Button>
        </div>
        <VoiceControl
          onFilterByAssignee={handleFilterByAssignee}
          onShowAll={loadAllIssues}
          onCreateIssue={handleCreate}
          onDeleteIssue={handleDelete}
          selectedIssue={selectedIssue.value}
        />
      </div>

      <Grid 
        items={issues.value}
        selectedItems={selectedIssue.value ? [selectedIssue.value] : []}
        onActiveItemChanged={(e: CustomEvent) => {
          const selected = e.detail.value as Issue;
          selectedIssue.value = selected;
          read(selected);
        }}
      >
        <GridColumn path="id" header="ID" autoWidth/>
        <GridColumn path="title" header="Title" autoWidth/>
        <GridColumn path="description" header="Description" />
        <GridColumn path="status" header="Status" autoWidth/>
        <GridColumn path="assignee" header="Assignee" autoWidth/>
      </Grid>

      {selectedIssue.value && (
        <FormLayout>
          <TextField
            label="Title"
            {...field(model.title)}
          />
          <TextArea
            label="Description"
            {...field(model.description)}
          />
          <Select
            label="Status"
            items={Object.values(IssueStatus).map(status => ({ value: status, label: status.replace('_', ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase()) }))}
            {...field(model.status)}
          />
          <TextField
            label="Assignee"
            {...field(model.assignee)}
          />
          <div className="flex gap-m py-m">
            <Button theme="primary" onClick={submit}>
              {selectedIssue.value.id === 0 ? 'Create' : 'Update'}
            </Button>
            {selectedIssue.value.id !== 0 && (
              <Button theme="error" onClick={handleDelete}>Delete</Button>
            )}
            <Button theme="tertiary" onClick={() => {
              selectedIssue.value = null;
              clear();
            }}>Cancel</Button>
          </div>
        </FormLayout>
      )}
    </div>
  );
}
