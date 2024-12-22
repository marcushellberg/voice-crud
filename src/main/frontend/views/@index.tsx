import { useSignal } from '@vaadin/hilla-react-signals';
import { Grid } from '@vaadin/react-components/Grid.js';
import { GridColumn } from '@vaadin/react-components/GridColumn.js';
import { IssuesService } from 'Frontend/generated/endpoints';
import { useEffect } from 'react';

export default function IssuesView() {
  const issues = useSignal<any[]>([]);

  useEffect(() => {
    IssuesService.findAll().then((fetchedIssues) => {
      issues.value = fetchedIssues;
    });
  }, []);

  return (
    <div className="p-m flex flex-col gap-m">
      <Grid items={issues.value}>
        <GridColumn path="id" header="ID" autoWidth/>
        <GridColumn path="title" header="Title" autoWidth/>
        <GridColumn path="description" header="Description" />
        <GridColumn path="status" header="Status" autoWidth/>
        <GridColumn path="assignee" header="Assignee" autoWidth/>
      </Grid>
    </div>
  );
}
