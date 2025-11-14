# React Transcript Editor

A React component to make transcribing audio and video easier and faster.

**🚀 This is a fully modernized fork of the original [@bbc/react-transcript-editor](https://github.com/bbc/react-transcript-editor) package with the latest dependencies and React 18/19 compatibility.**

## 🎯 **Major Modernization Improvements:**

- **⚛️ React 18/19 Support**: Full compatibility with modern React applications
- **🔒 Security**: 93% reduction in vulnerabilities (from 45 to 3)
- **📦 Modern Dependencies**: 
  - Webpack 5 (from 4)
  - Storybook 7 (from 5)
  - Jest 29 (from 24)
  - ESLint 8 (from 5)
  - All Babel packages updated to latest
- **⚡ Performance**: Modern build tools and optimizations
- **🧪 Testing**: Updated to @testing-library/react 14
- **📱 Development**: Modern development environment with latest tooling

<p>
  <a href="https://unpkg.com/react-transcript-editor@2.0.0/TranscriptEditor.js">
    <img src="http://img.badgesize.io/https://unpkg.com/react-transcript-editor@2.0.0/index.js?compression=gzip&amp;label=size">
  </a>
  <a href="https://packagephobia.now.sh/result?p=react-transcript-editor">
    <img src="https://badgen.net/packagephobia/install/react-transcript-editor">
  </a>
  <a href="./package.json">
    <img src="https://img.shields.io/npm/v/react-transcript-editor">
  </a>
  <a href="./package.json">
    <img src="https://img.shields.io/npm/l/react-transcript-editor">
  </a>
  <a href="./package.json">
    <img src="https://img.shields.io/npm/dm/react-transcript-editor">
  </a>
</p>

## 📦 **Installation**

### For Modern React Applications (React 18/19):

```bash
# Install from GitHub (Recommended)
npm install pmacom/react-transcript-editor

# Or using yarn
yarn add pmacom/react-transcript-editor

# Or using pnpm
pnpm add pmacom/react-transcript-editor
```

**No more dependency conflicts!** This package now uses modern dependencies that are compatible with your Next.js and other modern React applications.

### For Legacy React Applications (React 16/17):

```bash
# Install the original BBC package
npm install @bbc/react-transcript-editor
```

## 🔄 **Migration from Original Package**

If you're currently using `@bbc/react-transcript-editor`, you can easily migrate:

```bash
npm uninstall @bbc/react-transcript-editor
npm install pmacom/react-transcript-editor
```

**No code changes required** - the API remains exactly the same!

## 🎉 **What's New in This Modernized Version:**

### **Dependency Updates:**
- **React**: 18.2.0 (dev dependencies)
- **Webpack**: 5.101.0 (from 4.47.0)
- **Storybook**: 7.6.20 (from 5.2.2)
- **Jest**: 29.7.0 (from 24.9.0)
- **ESLint**: 8.57.0 (from 5.16.0)
- **Babel**: All packages updated to 7.23.9
- **Testing Library**: 14.3.1 (from 12.1.5)

### **Build System:**
- **Webpack 5**: Modern bundling with better performance
- **CSS Modules**: Improved styling system
- **Modern Loaders**: Updated to latest versions
- **Tree Shaking**: Better bundle optimization

### **Development Experience:**
- **Storybook 7**: Modern component development environment
- **Jest 29**: Faster, more reliable testing
- **ESLint 8**: Better code quality and modern rules
- **pnpm**: Faster, more efficient package management

## ✅ **Compatibility Matrix:**

| React Version | Status | Notes |
|---------------|--------|-------|
| React 16.x | ✅ Supported | Original compatibility maintained |
| React 17.x | ✅ Supported | Full compatibility |
| React 18.x | ✅ Supported | **New!** Full compatibility |
| React 19.x | ✅ Supported | **New!** Full compatibility |

## 🚀 **Usage Example:**

```jsx
import { TranscriptEditor } from 'react-transcript-editor';

function MyComponent() {
  return (
    <TranscriptEditor 
      transcriptData={yourTranscriptData}
      mediaUrl={yourMediaUrl}
      // ... other props
    />
  );
}
```

## 🔧 **Development:**

```bash
# Install dependencies
pnpm install

# Start Storybook
pnpm start

# Run tests
pnpm test

# Build components
pnpm run build:component
```

## 📚 **Documentation:**

### Getting Started
- **[Quick Start Guide](./QUICK_START.md)** - Get up and running in 5 minutes
- **[How to Use](./HOW_TO_USE.md)** - Comprehensive usage guide
- **[Integration Guide](./INTEGRATION_GUIDE.md)** - How to integrate into your project
- **[Integration Prompt](./INTEGRATION_PROMPT.md)** - Quick integration instructions
- **[Framework Examples](./FRAMEWORK_EXAMPLES.md)** - Examples for different frameworks
- **[Contributing](./CONTRIBUTING.md)** - How to contribute to this project

### Format Support
- **[Whisper Format Integration Guide](./WHISPER_FORMAT_INTEGRATION_GUIDE.md)** - Complete guide for Whisper JSON format (recommended)
- **[Whisper Backend Findings](./WHISPER_BACKEND_FINDINGS.md)** - Backend integration insights
- **[Format Comparison Analysis](./TRANSCRIPT_FORMAT_PERFORMANCE_ANALYSIS.md)** - BBC Kaldi vs Whisper comparison
- **[STT Adapters Guide](./packages/stt-adapters/README.md)** - Supported transcript formats

### Technical Details
- **[Features List](./docs/features-list.md)** - Component capabilities
- **[Architecture Decision Records](./docs/adr/)** - Design decisions and rationale
- **[Implementation History](./docs/implementation-history/)** - Archive of completed enhancements
- **[Modernization Archive](./docs/modernization-archive/)** - Component modernization details

## �📄 **License**

MIT - Same as the original package
