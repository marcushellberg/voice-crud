import { useEffect, useRef, useState, useCallback } from 'react';
import { RealtimeService } from 'Frontend/generated/endpoints';
import Issue from 'Frontend/generated/com/example/application/Issue';
import { Button } from '@vaadin/react-components/Button.js';

interface VoiceControlProps {
  onFilterByAssignee: (assignee: string) => void;
  onShowAll: () => void;
  onCreateIssue: () => void;
  onDeleteIssue: () => void;
  onSelectIssue: (id: number) => void;
  onUpdateIssue: (id: number, updates: Partial<Issue>) => void;
  selectedIssue: Issue | null;
  issues: Issue[];
}

export function VoiceControl({
  onFilterByAssignee,
  onShowAll,
  onCreateIssue,
  onDeleteIssue,
  onSelectIssue,
  onUpdateIssue,
  selectedIssue,
  issues,
}: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const dataChannel = useRef<RTCDataChannel | null>(null);

  useEffect(() => {
    return () => {
      peerConnection.current?.close();
    };
  }, []);

  const handleMessage = useCallback(async (msg: any) => {
    if (msg.type === 'response.function_call_arguments.done') {
      const args = JSON.parse(msg.arguments || '{}');
      
      switch (msg.name) {
        case 'filterByAssignee':
          onFilterByAssignee(args.assignee);
          break;
        case 'showAllIssues':
          onShowAll();
          break;
        case 'createNewIssue':
          onCreateIssue();
          break;
        case 'deleteCurrentIssue':
          if (selectedIssue) {
            onDeleteIssue();
          }
          break;
        case 'selectIssue':
          const issueExists = issues.some(issue => issue.id === args.id);
          if (issueExists) {
            onSelectIssue(args.id);
          }
          break;
        case 'updateIssue':
          if (selectedIssue) {
            const updates: Partial<Issue> = {};
            if (args.title) updates.title = args.title;
            if (args.description) updates.description = args.description;
            if (args.status) updates.status = args.status;
            if (args.assignee) updates.assignee = args.assignee;
            onUpdateIssue(selectedIssue.id, updates);
          }
          break;
      }

      // Send function call output
      if (dataChannel.current) {
        const event = {
          type: 'conversation.item.create',
          item: {
            type: 'function_call_output',
            call_id: msg.call_id,
            output: JSON.stringify({ success: true }),
          },
        };
        dataChannel.current.send(JSON.stringify(event));
      }
    }
  }, [selectedIssue, issues, onFilterByAssignee, onShowAll, onCreateIssue, onDeleteIssue, onSelectIssue, onUpdateIssue]);

  // Keep track of the latest message handler
  const latestHandleMessage = useRef(handleMessage);
  useEffect(() => {
    latestHandleMessage.current = handleMessage;
  }, [handleMessage]);

  async function initializeWebRTC() {
    try {
      // Get ephemeral token
      const tokenResponse = await RealtimeService.createEphemeralToken();
      const data = JSON.parse(tokenResponse);
      const EPHEMERAL_KEY = data.client_secret.value;

      // Create peer connection
      peerConnection.current = new RTCPeerConnection();
      const pc = peerConnection.current;

      // Set up audio playback
      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
      };

      // Add local audio track
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Set up data channel
      dataChannel.current = pc.createDataChannel('oai-events');
      const dc = dataChannel.current;

      dc.addEventListener('open', () => {
        console.log('Data channel opened');
        
        // Set up message handler when data channel opens
        const messageHandler = (ev: MessageEvent) => {
          const msg = JSON.parse(ev.data);
          // Always use the latest message handler from the ref
          latestHandleMessage.current(msg);
        };
        dc.addEventListener('message', messageHandler);
        
        configureTools();
      });

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = 'https://api.openai.com/v1/realtime';
      const model = 'gpt-4o-realtime-preview-2024-12-17';
      
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          'Content-Type': 'application/sdp',
        },
      });

      const answer: RTCSessionDescriptionInit = {
        type: 'answer' as RTCSdpType,
        sdp: await sdpResponse.text(),
      };
      await pc.setRemoteDescription(answer);
      setIsListening(true);
    } catch (error) {
      console.error('Failed to initialize WebRTC:', error);
      setIsListening(false);
    }
  }

  function configureTools() {
    if (!dataChannel.current) return;

    const event = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        tools: [
          {
            type: 'function',
            name: 'filterByAssignee',
            description: 'Filter issues by assignee name',
            parameters: {
              type: 'object',
              properties: {
                assignee: { type: 'string', description: 'Name of the assignee to filter by' },
              },
              required: ['assignee'],
            },
          },
          {
            type: 'function',
            name: 'showAllIssues',
            description: 'Show all issues without filtering',
          },
          {
            type: 'function',
            name: 'createNewIssue',
            description: 'Create a new issue',
          },
          {
            type: 'function',
            name: 'deleteCurrentIssue',
            description: 'Delete the currently selected issue',
          },
          {
            type: 'function',
            name: 'selectIssue',
            description: 'Select an issue by its ID number',
            parameters: {
              type: 'object',
              properties: {
                id: { type: 'number', description: 'The ID of the issue to select' },
              },
              required: ['id'],
            },
          },
          {
            type: 'function',
            name: 'updateIssue',
            description: 'Update the currently selected issue with new values',
            parameters: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'New title for the issue' },
                description: { type: 'string', description: 'New description for the issue' },
                status: { 
                  type: 'string', 
                  description: 'New status for the issue',
                  enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
                },
                assignee: { type: 'string', description: 'New assignee for the issue' }
              },
              minProperties: 1,
            },
          },
        ],
      },
    };

    dataChannel.current.send(JSON.stringify(event));
  }

  return (
    <div className="flex items-center gap-m">
      <Button
        theme={isListening ? 'primary' : 'secondary'}
        onClick={() => {
          if (isListening) {
            peerConnection.current?.close();
            setIsListening(false);
          } else {
            initializeWebRTC();
          }
        }}
      >
        {isListening ? '🎤 Voice Control Active' : '🎤 Enable Voice Control'}
      </Button>
    </div>
  );
}