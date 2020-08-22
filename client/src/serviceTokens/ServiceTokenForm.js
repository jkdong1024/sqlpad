import React, { useState } from 'react';
import Button from '../common/Button.tsx';
import HorizontalFormItem from '../common/HorizontalFormItem.tsx';
import Input from '../common/Input.tsx';
import message from '../common/message.tsx';
import Select from '../common/Select.tsx';
import { api } from '../utilities/fetch-json.js';
import { Link } from 'react-router-dom';

function ServiceTokenForm({ onServiceTokenGenerated }) {
  const [serviceTokenEdits, setServiceTokenEdits] = useState({});
  const [generating, setGenerating] = useState(false);

  const setServiceTokenValue = (key, value) => {
    setServiceTokenEdits((prev) => ({ ...prev, [key]: value }));
  };

  const generateServiceToken = async () => {
    if (generating) {
      return;
    }

    setGenerating(true);
    const json = await api.post('/api/service-tokens', serviceTokenEdits);
    if (json.error) {
      setGenerating(false);
      return message.error(json.error);
    }
    return onServiceTokenGenerated(json.data);
  };

  const { name = '', role = '', duration = '' } = serviceTokenEdits;

  return (
    <div style={{ height: '100%' }}>
      <p>
        You can make authorized API calls to some endpoints using a signed{' '}
        <Link to="jwt.io">JWT</Link> directly as a bearer token, rather than
        local user authentication, OAuth or SAML.
      </p>
      <p>
        When this is possible, you can avoid having to make a network request to
        external authorization server before making an API call or manage
        session cookies in your client. This makes accessing endpoints
        programmatically simple and secure.
      </p>
      <form
        onSubmit={generateServiceToken}
        autoComplete="off"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <HorizontalFormItem label="Service Name">
          <Input
            name="name"
            value={name || ''}
            error={!name}
            onChange={(event) =>
              setServiceTokenValue(event.target.name, event.target.value)
            }
          />
        </HorizontalFormItem>
        <HorizontalFormItem label="Access Role">
          <Select
            name="role"
            value={role}
            error={!role}
            onChange={(event) =>
              setServiceTokenValue(event.target.name, event.target.value)
            }
          >
            <option value="" />
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </Select>
        </HorizontalFormItem>
        <HorizontalFormItem label="Duration in hours (optional)">
          <Input
            name="duration"
            value={duration}
            onChange={(event) =>
              setServiceTokenValue(event.target.name, event.target.value)
            }
          />
        </HorizontalFormItem>
        <br />
        <div
          style={{
            borderTop: '1px solid #e8e8e8',
            paddingTop: '22px',
            textAlign: 'right',
          }}
        >
          <Button
            htmlType="submit"
            style={{ width: 120 }}
            variant="primary"
            onClick={generateServiceToken}
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Generate'}
          </Button>{' '}
        </div>
      </form>
    </div>
  );
}

export default ServiceTokenForm;
