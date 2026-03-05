# Contributing to IR Report Generator

Thank you for contributing! This tool helps SOC analysts build professional IR reports.

## How to Contribute

### Bug Reports

- Open an issue with browser info and steps to reproduce
- Include screenshots if it's a UI issue

### Adding Security Tools

1. Add tool to the relevant category in `app.js`
2. Include default finding fields
3. Update README.md tool list
4. Submit a Pull Request

### UI/UX Improvements

- Follow the existing dark theme design system
- Use CSS variables from `style.css`
- Test on Chrome, Firefox, and Edge
- Maintain responsive layout

## Testing

- Open `index.html` in a browser
- Test all 8 tool categories
- Verify report generation and all export formats (PDF, clipboard, JSON)
- Check localStorage save/load functionality

## License

By contributing, you agree to the MIT License.
