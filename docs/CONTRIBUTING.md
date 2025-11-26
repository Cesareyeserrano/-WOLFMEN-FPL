# 🤝 Contributing to Wolfmen FPL Tools

First off, thank you for considering contributing to Wolfmen FPL Tools! 🐺

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)

## Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. Please be kind and courteous.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (browser, OS, etc.)

### Suggesting Features

Feature suggestions are welcome! Please:

- **Use a clear title**
- **Provide detailed description**
- **Explain why this would be useful**
- **Include examples** if possible

### Code Contributions

1. **Fork the repo**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes** (see commit message guidelines)
6. **Push to your fork**
7. **Open a Pull Request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/-WOLFMEN-FPL.git
cd -WOLFMEN-FPL

# Install dependencies
npm install

# Login to Google
npx clasp login

# Create test project
npx clasp create --type sheets --title "Wolfmen FPL Tools (Dev)"

# Push code
npm run push

# Open in browser
npm run open
```

## Pull Request Process

1. **Update documentation** for any changed functionality
2. **Add tests** if applicable
3. **Ensure code follows style guidelines**
4. **Update README.md** if needed
5. **Request review** from maintainers

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing

## Coding Standards

### Google Apps Script Style

```javascript
// ✅ Good
function fetchJsonSafe_(url, cacheKey = null, ttlSec = 21600) {
  try {
    // Clear, commented code
    const data = JSON.parse(response);
    return data;
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    throw err;
  }
}

// ❌ Bad
function fetch(u,c,t){var d=JSON.parse(r);return d;}
```

### Naming Conventions

- **Public functions**: `camelCase` (e.g., `updateStandings`)
- **Private functions**: `camelCase_` with trailing underscore (e.g., `fetchData_`)
- **Constants**: `UPPER_CASE` (e.g., `CONFIG`, `COLORS_BASE`)
- **Variables**: `camelCase` (e.g., `teamId`, `currentGW`)

### File Organization

```
src/
├── config/          # Configuration files
├── utils/           # Utility functions
├── modules/         # Feature modules
└── main.gs          # Main entry point
```

### Comments

```javascript
/**
 * Fetch JSON with retry and optional cache
 * @param {string} url - The URL to fetch
 * @param {string} cacheKey - Optional cache key
 * @param {number} ttlSec - Cache TTL in seconds
 * @returns {Object} Parsed JSON response
 */
function fetchJsonSafe_(url, cacheKey = null, ttlSec = 21600) {
  // Implementation
}
```

### Error Handling

Always include try-catch blocks:

```javascript
function myFunction() {
  try {
    // Your code
    console.log('✅ Success');
  } catch (err) {
    console.error(`❌ myFunction failed: ${err.message}`);
    throw err;
  }
}
```

### Logging

Use consistent emoji prefixes:

```javascript
console.log('🔄 Processing...');  // In progress
console.log('✅ Success!');        // Success
console.error('❌ Error!');        // Error
console.log('⚠️ Warning!');        // Warning
console.log('ℹ️ Info');            // Info
```

## Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(ownership): add captain differential analysis

- Calculate captain pick differentials
- Add color coding for captain picks
- Update ownership sheet layout

Closes #123
```

```
fix(api): handle rate limit errors gracefully

- Add exponential backoff for 429 errors
- Increase retry attempts to 5
- Log rate limit hits

Fixes #456
```

### Scope Guidelines

- `standings`: Standings module
- `ownership`: Ownership module
- `evolution`: Evolution module
- `api`: API utilities
- `ui`: User interface
- `config`: Configuration
- `docs`: Documentation

## Testing

Before submitting:

```bash
# Push to test environment
npm run push

# Test all features
# 1. Update Standings
# 2. Generate Ownership
# 3. Generate Evolution
# 4. Update All
# 5. Clear Cache

# Check logs for errors
npm run logs
```

## Questions?

Feel free to:
- Open an issue
- Email: cesareyeserrano@gmail.com
- Start a discussion

---

**Thank you for contributing! 🐺⚽**
