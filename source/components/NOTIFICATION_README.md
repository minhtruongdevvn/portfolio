# Notification System

A Windows 7-style toast notification system with auto-dismiss functionality, designed for desktop simulator.

## Features

- **4 Notification Types**: Success, Error, Warning, Info
- **Auto-Dismiss**: Configurable duration or persistent
- **Pause on Hover**: Stops auto-dismiss when hovering
- **Smooth Animations**: Slide-in and slide-out effects
- **Queue Management**: Maximum 5 notifications (auto-removes oldest)
- **Mobile Responsive**: Adapts to small screens
- **Windows 7 Theme**: Glass effect with aero styling

## Quick Start

The notification system is globally available through the `notify` object:

```javascript
// Simple usage
notify.success("Operation completed!");
notify.error("Something went wrong!");
notify.warning("Be careful!");
notify.info("FYI: New update available");
```

## API Reference

### Helper Methods

#### `notify.success(message, duration)`

Shows a success notification with a green checkmark icon.

```javascript
notify.success("File saved successfully!");
notify.success("Upload complete!", 2000); // Custom 2s duration
```

**Parameters:**

- `message` (string): The notification message
- `duration` (number, optional): Auto-dismiss duration in milliseconds (default: 3000)

---

#### `notify.error(message, duration)`

Shows an error notification with a red X icon.

```javascript
notify.error("Failed to load data");
notify.error("Network error occurred", 5000); // Custom 5s duration
```

**Parameters:**

- `message` (string): The notification message
- `duration` (number, optional): Auto-dismiss duration in milliseconds (default: 5000)

---

#### `notify.warning(message, duration)`

Shows a warning notification with an orange triangle icon.

```javascript
notify.warning("Unsaved changes detected");
notify.warning("Low battery", 4000); // Custom 4s duration
```

**Parameters:**

- `message` (string): The notification message
- `duration` (number, optional): Auto-dismiss duration in milliseconds (default: 4000)

---

#### `notify.info(message, duration)`

Shows an info notification with a blue info icon.

```javascript
notify.info("Tip: Use Ctrl+S to save");
notify.info("New features available", 3000); // Custom 3s duration
```

**Parameters:**

- `message` (string): The notification message
- `duration` (number, optional): Auto-dismiss duration in milliseconds (default: 3000)

---

### Advanced Method

#### `notify.show(config)`

Shows a notification with full configuration options.

```javascript
notify.show({
  message: "Custom notification",
  type: "success", // 'success', 'error', 'warning', 'info'
  duration: 5000, // milliseconds (0 = no auto-dismiss)
  onClose: () => {
    // callback when notification closes
    console.log("Notification closed");
  },
});
```

**Parameters:**

- `config` (object):
  - `message` (string, required): The notification message
  - `type` (string, optional): Notification type (default: 'info')
  - `duration` (number, optional): Auto-dismiss duration in ms (default: 3000, use 0 for persistent)
  - `onClose` (function, optional): Callback function when notification closes

**Returns:** Notification instance

---

### Other Methods

#### `notify.clearAll()`

Closes all active notifications immediately.

```javascript
notify.clearAll();
```

---

## Usage Examples

### Basic Notifications

```javascript
// Success message
notify.success("Changes saved successfully!");

// Error message
notify.error("Unable to connect to server");

// Warning message
notify.warning("Session will expire in 5 minutes");

// Info message
notify.info("Press F11 for fullscreen mode");
```

### Custom Duration

```javascript
// Quick 1-second notification
notify.info("Copied to clipboard", 1000);

// Long 10-second error
notify.error("Critical error - please contact support", 10000);

// Persistent notification (won't auto-dismiss)
notify.show({
  message: "Action required: Please review settings",
  type: "warning",
  duration: 0, // 0 = never auto-dismiss
});
```

### With Callbacks

```javascript
// Track when notification closes
notify.show({
  message: "File upload in progress...",
  type: "info",
  duration: 5000,
  onClose: () => {
    console.log("Upload notification closed");
    // Perform cleanup or show next step
  },
});

// Chain notifications
notify.show({
  message: "Step 1 complete",
  type: "success",
  duration: 2000,
  onClose: () => {
    notify.info("Moving to step 2...");
  },
});
```

### Real-World Scenarios

#### Form Validation

```javascript
function submitForm(formData) {
  if (!formData.email) {
    notify.warning("Email is required");
    return;
  }

  if (!formData.password) {
    notify.warning("Password is required");
    return;
  }

  // Submit form
  notify.success("Form submitted successfully!");
}
```

#### File Operations

```javascript
async function saveFile(file) {
  try {
    await uploadFile(file);
    notify.success("File saved successfully!");
  } catch (error) {
    notify.error("Failed to save file: " + error.message);
  }
}
```

#### Network Requests

```javascript
async function fetchData() {
  notify.info("Loading data...");

  try {
    const response = await fetch("/api/data");
    const data = await response.json();
    notify.success("Data loaded successfully!");
    return data;
  } catch (error) {
    notify.error("Failed to load data. Please try again.");
    throw error;
  }
}
```

#### User Actions

```javascript
function deleteItem(itemId) {
  notify.show({
    message: "Are you sure? This cannot be undone.",
    type: "warning",
    duration: 0, // Persistent
    onClose: () => {
      // User manually closed it, assume they don't want to delete
      notify.info("Delete cancelled");
    },
  });
}

function confirmDelete(itemId) {
  // Actually delete
  notify.success("Item deleted successfully");
}
```

#### Copy to Clipboard

```javascript
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      notify.success("Copied to clipboard!", 1500);
    })
    .catch(() => {
      notify.error("Failed to copy");
    });
}
```

## Browser Console Testing

You can test notifications directly from the browser console:

```javascript
// Try different types
notify.success("Success test!");
notify.error("Error test!");
notify.warning("Warning test!");
notify.info("Info test!");

// Test multiple notifications
for (let i = 1; i <= 5; i++) {
  setTimeout(() => {
    notify.info(`Notification ${i}`);
  }, i * 500);
}

// Test clear all
notify.clearAll();

// Test persistent notification
notify.show({
  message: "I will not auto-dismiss!",
  type: "warning",
  duration: 0,
});
```

## Behavior

### Auto-Dismiss

- Notifications automatically close after their duration expires
- Default durations:
  - Success: 3 seconds
  - Error: 5 seconds
  - Warning: 4 seconds
  - Info: 3 seconds

### Hover Pause

- When you hover over a notification, the auto-dismiss timer stops
- When you move the mouse away, it resumes with 2 seconds remaining

### Queue Management

- Maximum 5 notifications can be shown at once
- When the 6th notification is shown, the oldest one is automatically closed
- This prevents notification overflow on the screen

### Manual Close

- Click the × button on any notification to close it immediately
- Use `notify.clearAll()` to close all notifications at once

## Styling

The notifications use Windows 7 aero glass styling with:

- Semi-transparent dark background
- Glass border effect
- Colored left accent border based on type
- Backdrop blur for modern glass effect
- Smooth slide-in/slide-out animations

### Mobile Responsive

On screens ≤ 700px wide:

- Notifications span full width (with 10px margins)
- Slightly smaller font size
- Positioned near the top (10px from top)

## File Structure

```
js/
├── components/
│   ├── Notification.js           # Individual notification component
│   └── NOTIFICATION_README.md    # This file
└── managers/
    └── NotificationManager.js    # Notification system manager

css/
└── components/
    └── notification.css          # Notification styles
```

## Technical Details

### Initialization

The notification system is automatically initialized in `js/main.js`:

```javascript
import { notify } from "./managers/NotificationManager.js";

// In app.init()
notify.init();
```

### Global Access

The `notify` object is available globally for easy access:

```javascript
window.notify = notify;
```

### XSS Protection

All notification messages are automatically HTML-escaped to prevent XSS attacks:

```javascript
// This is safe - HTML will be escaped
notify.info('<script>alert("XSS")</script>');
// Shows: <script>alert("XSS")</script>
```

## Best Practices

1. **Choose the Right Type**
   - Success: Confirmations, successful operations
   - Error: Failures, critical issues
   - Warning: Warnings, things to be aware of
   - Info: General information, tips

2. **Keep Messages Short**
   - Aim for one sentence
   - Be clear and concise
   - Use action-oriented language

3. **Use Appropriate Durations**
   - Quick feedback: 1-2 seconds
   - Normal messages: 3-4 seconds
   - Errors/Important: 5-6 seconds
   - Critical/Action required: 0 (persistent)

4. **Don't Overuse**
   - Don't show notifications for every tiny action
   - Group related actions if possible
   - Use for significant events only

5. **Accessibility**
   - Messages should be clear and descriptive
   - Provide enough time to read (minimum 3s)
   - Consider screen reader compatibility

## Examples by Use Case

### File Management

```javascript
// Upload
notify.info("Uploading file...");
notify.success("File uploaded successfully!");
notify.error("Upload failed - file too large");

// Download
notify.info("Download started");
notify.success("Download complete!");
```

### Form Handling

```javascript
// Validation
notify.warning("Please enter a valid email address");
notify.warning("Password must be at least 8 characters");

// Submission
notify.success("Form submitted successfully!");
notify.error("Submission failed - please try again");
```

### User Actions

```javascript
// Copy/Paste
notify.success("Copied to clipboard!", 1500);

// Save
notify.success("Settings saved");

// Delete
notify.warning("Are you sure you want to delete this?");
notify.success("Item deleted");
```

### System Messages

```javascript
// Connection
notify.error("Connection lost - attempting to reconnect...");
notify.success("Connection restored");

// Updates
notify.info("New version available - click to update");

// Maintenance
notify.warning("Scheduled maintenance in 10 minutes");
```

## Troubleshooting

**Notifications not appearing?**

- Check that `notify.init()` is called
- Verify the CSS file is loaded
- Check browser console for errors

**Notifications look wrong?**

- Ensure `notification.css` is loaded after other styles
- Check for CSS conflicts with z-index
- Verify backdrop-filter is supported in your browser

**Too many notifications?**

- Maximum 5 will show at once
- Use `notify.clearAll()` to reset
- Consider reducing notification frequency

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (backdrop-filter may vary)
- Mobile browsers: ✅ Responsive design

## License

Part of the Desktop Simulator project by Conrad Truong.
