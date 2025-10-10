# Server Configuration

This module provides functionality to configure the server URL dynamically without requiring a new app release.

## Features

- **Dynamic Server URL**: Change the API server URL without rebuilding the app
- **Persistent Storage**: Settings are saved using Ionic Storage
- **Validation**: URL format validation and automatic formatting
- **Fallback**: Falls back to environment variable if no custom config is set
- **UI Integration**: Easy-to-use modal and button components

## Usage

### Basic Usage

```typescript
import { serverConfigManager } from "@/shared/config/serverConfig";

// Get current configuration
const config = await serverConfigManager.getConfig();

// Update server URL
await serverConfigManager.setConfig({
    baseUrl: "https://new-api.example.com",
    isCustom: true
});

// Reset to default
await serverConfigManager.resetToDefault();
```

### React Hook

```typescript
import { useServerConfig } from "@/shared/hooks/useServerConfig";

const MyComponent = () => {
    const { config, updateConfig, resetToDefault } = useServerConfig();
    
    // Use config.baseUrl for API calls
    // Use updateConfig() to change settings
};
```

### UI Components

```typescript
import { ServerConfigButton, ServerConfigModal } from "@/shared/ui";

// Button to open settings
<ServerConfigButton variant="full" />

// Modal for configuration
<ServerConfigModal isOpen={isOpen} onClose={onClose} />
```

## Configuration Flow

1. App starts and loads configuration from storage
2. If no custom config exists, uses `VITE_API_URL` environment variable
3. User can change settings through the UI
4. New settings are saved to storage and API client is updated
5. All subsequent API calls use the new URL

## Storage

Configuration is stored in Ionic Storage with the key `"server_config"`:

```typescript
{
    baseUrl: string;    // The API server URL
    isCustom: boolean;  // Whether this is a user-defined setting
}
```

## API Integration

The API client automatically uses the configured URL:

```typescript
import { api, updateApiBaseUrl } from "@/shared/api/api";

// API instance automatically uses configured URL
const response = await api.get("/users");

// Manually update URL (usually done by the config manager)
await updateApiBaseUrl("https://new-server.com");
```
