# Windows 7 Desktop Interface

A clean, maintainable Windows 7 desktop interface built with vanilla HTML, CSS, and JavaScript (ES6 modules).

## Features

- **Desktop Icons**: 6 customizable desktop icons (Computer, Recycle Bin, File Explorer, Steam, Photos, Movies)
- **Drag & Drop**: Free-form icon positioning with boundary checking
- **Left-Click Menus**: Dropdown menus with customizable options for each icon
- **Taskbar**: Full Windows 7 style taskbar with:
  - Start button
  - Pinned applications
  - Real-time clock
  - System tray icons
- **S3-Ready Asset Management**: Centralized asset configuration for easy CDN/S3 migration
- **Windows 7 Aesthetic**: Authentic glass effect and beautiful gradient background

## Project Structure

```
portfolio/
├── index.html                      # Main entry point
├── assets/
│   ├── icons/                      # Desktop & taskbar icons
│   └── wallpapers/                 # Background images
├── css/
│   ├── main.css                    # CSS variables & global styles
│   ├── reset.css                   # CSS reset
│   ├── components/                 # Component-specific styles
│   └── utilities/                  # Reusable animations
└── js/
    ├── main.js                     # Application initialization
    ├── config/
    │   └── desktop-config.js       # Icon configurations
    ├── components/                 # UI components
    ├── managers/                   # State, drag-drop, menu managers
    └── utils/                      # Utility functions
```

## Architecture

### Components
- **DesktopIcon**: Individual desktop icon with drag & menu capabilities
- **Taskbar**: Main taskbar container
- **StartButton**: Windows Start button
- **TaskbarApp**: Individual taskbar application icons
- **SystemTray**: Clock and system icons
- **DropdownMenu**: Context menu component

### Managers
- **StateManager**: Centralized in-memory state management
- **DragDropManager**: Handles drag & drop operations
- **MenuManager**: Manages dropdown menus (singleton pattern)

### Technology Stack
- **JavaScript**: ES6 classes and modules (no build tools required)
- **CSS**: BEM methodology with CSS custom properties
- **HTML5**: Semantic markup with native drag & drop API

## Getting Started

### Local Development

Since this project uses ES6 modules, you must serve it via HTTP (not file://):

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx serve

# Using PHP
php -S localhost:8080
```

Then open http://localhost:8080 in your browser.

**Note**: Opening `index.html` directly in a browser won't work due to CORS restrictions on ES6 modules.

## Usage

### Desktop Icons
- **Single Click**: Shows dropdown menu with options
- **Double Click**: Reserved for future "exciting" functionality
- **Drag & Drop**: Click and drag to reposition icons freely

### Taskbar
- **Start Button**: Click to open Start menu (coming soon)
- **App Icons**: Click to launch/activate applications (coming soon)
- **Clock**: Displays current time and date in real-time
- **System Tray**: Volume and network icons (placeholders)

### Dropdown Menus
- **Open**: Left-click on any icon
- **Close**: Click outside menu or select an option
- **Navigate**: Hover over items to highlight

## Customization

### Adding Desktop Icons

Edit `js/config/desktop-config.js`:

```javascript
export const DESKTOP_ICONS = [
  {
    id: 'my-app',
    name: 'My Application',
    icon: 'assets/icons/my-app.svg',
    position: { x: 20, y: 20 },
    menuItems: [
      { id: 'open', label: 'Open', action: 'open' },
      { id: 'settings', label: 'Settings', action: 'settings' }
    ]
  }
];
```

### Changing Theme Colors

Edit CSS variables in `css/main.css`:

```css
:root {
  --win7-blue: #3C89D2;
  --desktop-bg: linear-gradient(...);
  /* etc */
}
```

### Adding Taskbar Apps

Edit `js/config/desktop-config.js`:

```javascript
export const TASKBAR_APPS = [
  {
    id: 'my-app',
    name: 'My App',
    icon: 'assets/icons/my-app.svg',
    pinned: true,
    running: false
  }
];
```

## Migrating Assets to S3 or CDN

This project is designed for easy asset migration to AWS S3, CloudFront, or any CDN. All asset paths are centralized in `js/config/assets.js`.

### Steps to Migrate:

1. **Upload Assets to S3:**
   ```bash
   # Upload all assets to your S3 bucket
   aws s3 sync assets/ s3://your-bucket-name/assets/ --acl public-read
   ```

2. **Update the Base URL:**

   Edit `js/config/assets.js`:
   ```javascript
   // Change from:
   export const BASE_URL = '';

   // To your S3/CDN URL:
   export const BASE_URL = 'https://your-bucket.s3.amazonaws.com/';
   // or CloudFront:
   export const BASE_URL = 'https://d1234567890.cloudfront.net/';
   ```

3. **That's it!** All icons and images will now load from S3/CDN.

### Why This Approach?

- **Single Point of Change**: Update one line to switch all assets
- **No Code Refactoring**: All components automatically use the new URLs
- **Easy Rollback**: Simply change the BASE_URL back
- **Version Control**: Easy to manage different environments (dev/staging/prod)

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ❌ Not supported (requires ES6 modules)

## Future Enhancements

- Window management (draggable, resizable windows)
- Start menu
- File system simulation
- Context menu customization
- Theme switcher
- Settings panel
- Keyboard shortcuts

## Development

No build tools required. Simply edit the files and refresh your browser.

### Debugging

The application instance is available globally:
```javascript
console.log(window.desktopApp);
```

### File Structure

See the project structure section above for a complete overview of how files are organized.

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Credits

Created with clean, maintainable architecture for easy extension and learning.
