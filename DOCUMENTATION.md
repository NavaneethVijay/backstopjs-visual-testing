# Visual Testing Documentation

## Overview
This project provides a UI interface for BackstopJS visual regression testing, allowing users to compare and analyze visual differences between reference and test websites. It's built using:

- Vite + React for the frontend
- BackstopJS for visual regression testing
- Playwright for browser automation
- GitHub Actions for CI/CD
- Vercel for deployment

## Setup Instructions

### Prerequisites
- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)
- Git

### Installation Steps

1. Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd <project-directory>
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

3. Configure your websites in `website-config.js`:
```javascript
export const websites = [
  {
    name: "your_website_name",
    referenceDomain: "your_reference_domain.com",
    domain: "your_production_domain.com",
    defaultStorageState: {
      cookies: [
        {
          name: "cookie_key",
          value: "cookie_value",
        }
      ],
      localStorage: [
        {
          name: "localstorge_key",
          value: "",
        }
      ]
    }
  }
];
```

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Generate BackstopJS configuration files:
```bash
npm run backstop:generate
```

3. Create reference screenshots:
```bash
npm run backstop:reference
```

4. Run visual regression tests:
```bash
npm run backstop:test
```

## Project Structure

### Key Components

1. **Config Generator**
   - Generates BackstopJS configuration files based on website settings
   - Fetches URLs from sitemap
   - Handles cookie and localStorage configuration

2. **Test Runner**
   - Executes visual regression tests
   - Generates test reports
   - Handles error cases and reporting

3. **Report Viewer**
   - Provides UI for test result analysis
   - Supports side-by-side comparison
   - Includes image scrubber functionality

## Features

### 1. Visual Comparison Tools
- Side-by-side comparison of reference and test images
- Diff highlighting for visual differences
- Image scrubber for detailed comparison

### 2. Test Management
- Filter tests by status (passed/failed)
- Search functionality
- Pagination for large test sets

### 3. Settings and Configuration
- Toggle visibility of reference/test/diff images
- Text information display options
- Viewport selection (desktop/mobile)

## CI/CD Integration

The project includes GitHub Actions workflow for automated testing:

Features:
- Automated test execution
- Artifact generation and storage
- Vercel deployment integration

## Troubleshooting

1. **Missing Reports**
   - Ensure the `reports` directory exists
   - Check if BackstopJS tests completed successfully
   - Verify file permissions

2. **Test Failures**
   - Check network connectivity to reference and test domains
   - Verify cookie and localStorage configurations
   - Review browser console for JavaScript errors

3. **Configuration Issues**
   - Validate JSON syntax in config files
   - Ensure all required paths exist
   - Check domain accessibility and permissions

## Best Practices

1. **Test Configuration**
   - Use meaningful test names
   - Set appropriate viewport sizes
   - Configure reasonable wait times for dynamic content

2. **Reference Images**
   - Keep reference images up-to-date
   - Document visual changes
   - Use version control for reference images

3. **CI/CD Integration**
   - Regular automated testing
   - Proper error handling
   - Artifact preservation

For specific issues or advanced configurations, please refer to the individual component documentation or raise an issue in the repository.

## Scripts Documentation

### Config Generator (`scripts/config-generator.js`)

#### Purpose
Generates BackstopJS configuration files for each website defined in `website-config.js`.

#### Requirements
```javascript
{
  name: "website_name",          // Unique identifier for the website
  referenceDomain: "ref.com",    // Domain for reference screenshots
  domain: "test.com",            // Domain for test screenshots
  defaultStorageState: {         // Optional: Authentication/state data
    cookies: [{
      name: "session",
      value: "xyz"
    }],
    localStorage: [{
      name: "theme",
      value: "dark"
    }]
  }
}
```

#### Working
1. Fetches URLs from the reference domain's API endpoint
2. Generates storage state files for authentication
3. Creates BackstopJS config with:
   - Unique scenarios for each URL
   - Custom paths for reports and screenshots
   - Storage state configuration
   - Engine options for Playwright

#### Expected Output
```javascript
{
  id: "website_name",
  paths: {
    bitmaps_reference: "public/website_name/bitmaps_reference",
    bitmaps_test: "public/website_name/bitmaps_test",
    engine_scripts: "backstop_data/website_name/engine_scripts",
    html_report: "public/website_name/report",
    ci_report: "public/website_name/ci_report",
    json_report: "reports/website_name"
  },
  scenarios: [
    {
      label: "Scenario 1",
      url: "https://test.com/path",
      referenceUrl: "https://ref.com/path",
      delay: 8000
    }
    // ... more scenarios
  ]
}
```

### Test Runner (`scripts/test.js`)

#### Purpose
Executes BackstopJS tests using generated configuration files.

#### Requirements
- Valid BackstopJS configuration file
- Accessible reference and test domains
- Proper storage state configuration (if authentication required)

#### Working
1. Reads configuration file for specified website
2. Executes BackstopJS test command
3. Processes test results
4. Generates JSON report
5. Updates file paths in reports for web viewing

#### Expected Output
```javascript
{
  id: "website_name",
  tests: [
    {
      pair: {
        reference: "/website_name/bitmaps_reference/scenario1.png",
        test: "/website_name/bitmaps_test/scenario1.png",
        diff: "/website_name/bitmaps_test/scenario1_diff.png"
      },
      status: "pass", // or "fail"
      diffRatio: 0,   // Percentage of difference
      label: "Scenario 1"
    }
    // ... more test results
  ]
}
```

### Report Viewer (`src/routes/ReportApp.jsx`)

#### Purpose
Provides a UI for viewing and analyzing test results.

#### Requirements
- Valid JSON report file in `reports/{website}/jsonReport.json`
- Image files in correct locations:
  - `public/{website}/bitmaps_reference/`
  - `public/{website}/bitmaps_test/`

#### Features
1. **Image Comparison**
   ```javascript
   {
     reference: "/path/to/reference.png",
     test: "/path/to/test.png",
     diff: "/path/to/diff.png",
     diffRatio: 0.12,           // Difference percentage
     dimensions: {
       width: 1920,
       height: 1080
     }
   }
   ```

2. **Test Filtering**
   ```javascript
   {
     status: "fail",            // Filter by test status
     label: "Homepage",         // Search by test name
     diffRatio: {              // Filter by difference ratio
       min: 0,
       max: 100
     }
   }
   ```

3. **Settings Management**
   ```javascript
   {
     viewportSettings: {
       width: 1920,            // Viewport width
       height: 1080           // Viewport height
     },
     displaySettings: {
       showReference: true,    // Show/hide reference image
       showTest: true,         // Show/hide test image
       showDiff: true         // Show/hide diff image
     }
   }
   ```

## Directory Structure
```
├── scripts/
│   ├── config-generator.js    # Generates BackstopJS configs
│   └── test.js               # Runs visual regression tests
├── public/
│   └── {website}/
│       ├── bitmaps_reference/ # Reference screenshots
│       ├── bitmaps_test/     # Test screenshots
│       └── report/           # HTML reports
├── reports/
│   └── {website}/
│       └── jsonReport.json   # Test results data
├── backstop_data/
│   └── {website}/
│       └── engine_scripts/   # Playwright scripts
└── website-config.js         # Website configurations
```

## Common Issues and Solutions

### 1. URL Fetching Fails
```javascript
// Ensure API endpoint is accessible and returns correct format
{
  urls: [
    "/path1",
    "/path2"
    // ... more URLs
  ]
}
```

### 2. Authentication Issues
```javascript
// Verify storage state format
{
  cookies: [
    {
      name: "required_cookie_name",
      value: "valid_cookie_value",
      domain: ".example.com",
      path: "/"
    }
  ]
}
```

### 3. Screenshot Mismatches
- Check viewport configurations
- Verify dynamic content handling
- Ensure consistent test conditions
```javascript
{
  viewports: [
    {
      label: "desktop",
      width: 1920,
      height: 1080
    }
  ],
  delay: 8000,  // Adjust for dynamic content
  hideSelectors: [
    ".dynamic-content",
    ".advertisement"
  ]
}
```

## Available Scripts

### NPM Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "backstop:init": "backstop init",
    "backstop:test": "node scripts/test.js",
    "backstop:approve": "backstop approve",
    "backstop:reference": "backstop reference",
    "backstop:generate": "node scripts/config-generator.js"
  }
}
```

### Development Scripts

#### `npm run dev`
- **Purpose**: Starts the development server
- **Usage**: Used during local development
- **Output**: Runs the application on `localhost:3000` (or next available port)
```bash
npm run dev
```

#### `npm run build`
- **Purpose**: Creates production build
- **Usage**: Used for deployment
- **Output**: Generates optimized build in `dist` directory
```bash
npm run build
```

#### `npm run preview`
- **Purpose**: Preview production build locally
- **Usage**: Test production build before deployment
- **Output**: Serves the built application locally
```bash
npm run preview
```

### BackstopJS Scripts

#### `npm run backstop:init`
- **Purpose**: Initializes BackstopJS in the project
- **Usage**: Only needed for first-time setup
- **Output**: Creates initial BackstopJS configuration and directory structure
```bash
npm run backstop:init
```

#### `npm run backstop:generate`
- **Purpose**: Generates BackstopJS configuration files
- **Usage**: Run before creating reference or test screenshots
- **Requirements**: Valid `website-config.js` file
- **Output**: Creates `{website-name}.json` configuration files
```bash
npm run backstop:generate
# or for specific website
npm run backstop:generate --config=website-name
```

#### `npm run backstop:reference`
- **Purpose**: Creates reference screenshots
- **Usage**: Run to establish baseline images
- **Requirements**: Valid BackstopJS configuration file
- **Output**: Generates reference screenshots in `public/{website}/bitmaps_reference/`
```bash
npm run backstop:reference --config=website-name
```

#### `npm run backstop:test`
- **Purpose**: Runs visual regression tests
- **Usage**: Compare current site against reference screenshots
- **Requirements**:
  - Valid BackstopJS configuration
  - Existing reference screenshots
- **Output**:
  - Test screenshots in `public/{website}/bitmaps_test/`
  - HTML report in `public/{website}/report/`
  - JSON report in `reports/{website}/`
```bash
npm run backstop:test --config=website-name
```

#### `npm run backstop:approve`
- **Purpose**: Approves test screenshots as new references
- **Usage**: When intentional changes need to be accepted
- **Requirements**: Existing test screenshots
- **Output**: Copies test screenshots to reference directory
```bash
npm run backstop:approve --config=website-name
```

### Environment Variables

```env
# Required for CI/CD
VERCEL_ORG_ID=xxx
VERCEL_PROJECT_ID=xxx
VERCEL_TOKEN=xxx

# Optional for local development
DEBUG=true
NODE_ENV=development
```

### Script Execution Flow

1. **Initial Setup**
```bash
npm install
npx playwright install
npm run backstop:init
```

2. **Configuration Generation**
```bash
npm run backstop:generate
```

3. **Reference Creation**
```bash
npm run backstop:reference --config=website-name
```

4. **Test Execution**
```bash
npm run backstop:test --config=website-name
```

5. **Results Review**
```bash
npm run dev
# Navigate to http://localhost:3000/report/{website-name}
```

### Common Script Usage Patterns

#### Full Test Cycle
```bash
# Generate fresh config
npm run backstop:generate --config=website-name

# Create new reference screenshots
npm run backstop:reference --config=website-name

# Run tests
npm run backstop:test --config=website-name

# Start UI to view results
npm run dev
```

#### Update References
```bash
# Run tests first
npm run backstop:test --config=website-name

# Approve changes
npm run backstop:approve --config=website-name
```

#### CI/CD Pipeline
```bash
# Usually executed in this order
npm run backstop:generate
npm run backstop:reference
npm run backstop:test
npm run build
```