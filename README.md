# Prima Wrap Product Label Printing

[![Python](https://img.shields.io/badge/Python-3.13.0-blue.svg)](https://www.python.org/)
[![Eel](https://img.shields.io/badge/Eel-0.14.0-green.svg)](https://github.com/python-eel/Eel)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern desktop application for product label printing using ZPL (Zebra Programming Language) designed specifically for Prima Wrap, a family-owned business in Niagara Falls, Ontario, Canada.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Usage](#usage)
- [Technical Details](#technical-details)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Prima Wrap Product Label Printing is a desktop application that streamlines inventory management and label printing processes. Built with Python Eel, it provides a modern web-based interface that connects directly to product SKU databases, enabling efficient label generation and printing using ZPL technology.

### Background Story

Prima Wrap, a family-owned business in Niagara Falls, Ontario, Canada, previously relied on an outdated Microsoft Access application for inventory and label printing. The old system was slow, error-prone, and difficult to manage with their expanding SKU database. This application was developed to modernize their workflow, significantly improving efficiency and reducing manual data entry errors.

## ✨ Features

### Core Functionality

- **Product Database Integration**: Direct connection to Excel-based SKU database
- **ZPL Label Generation**: Automatic generation of Zebra Programming Language labels
- **Multiple Barcode Types**: Support for Code128 and DataMatrix barcodes
- **Image Integration**: Convert custom images to ZPL format for label printing
- **Batch Printing**: Print multiple labels with quantity selection
- **Printer Management**: Automatic printer detection and selection

### User Interface

- **Modern Web-Based UI**: Clean, responsive interface built with HTML5/CSS3/JavaScript
- **Expert/Basic Modes**: Two operation modes for different user skill levels
- **Interactive Tutorial**: Built-in help system with guided tours
- **Real-time Clock**: Digital clock and date display
- **Auto-complete Search**: Intelligent product search with suggestions

### Advanced Features

- **Custom ZPL Mode**: Direct ZPL code editing for advanced users
- **Printer Configuration**: Comprehensive printer settings and calibration
- **Image Processing**: Convert PNG images to ZPL format
- **Database Management**: Excel file integration for product data
- **Settings Panel**: Advanced printer configuration options

## 📸 Screenshots

_Screenshots would be added here from the presentation files_

## 🚀 Installation

### Prerequisites

- **Python 3.13.0** (recommended)
- **Google Chrome** or **Chromium** browser
- **Windows 11** (tested environment)
- **At least one printer** (physical or virtual like "Print to PDF")

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd "Prima Wrap Product Label Printing v4"
   ```

2. **Create a virtual environment**

   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Verify printer availability**
   - Ensure at least one printer is installed on your system
   - Virtual printers like "Print to PDF" are acceptable

## 💻 Usage

### Starting the Application

```bash
python label.py
```

The application will launch in a Chrome/Chromium window with the following interface:

### Basic Operation

1. **Select Printer**: Choose your target printer from the dropdown menu
2. **Search Products**: Enter a product number and click search
3. **Review Information**: Verify product details (description, prices)
4. **Set Quantity**: Choose how many labels to print
5. **Print**: Click the print button to generate and print labels

### Expert Mode

Enable Expert Mode to access advanced features:

- **Custom ZPL Editing**: Direct ZPL code modification
- **Barcode Type Selection**: Choose between Code128 and DataMatrix
- **Advanced Settings**: Printer calibration and configuration options

### Custom Images

1. Place your PNG images in `web/assets/custom/`
2. Select "Custom Image" mode
3. Choose your image file
4. The application will convert it to ZPL format automatically

## 🔧 Technical Details

### Architecture

- **Backend**: Python 3.13.0 with Eel framework
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: SQLite for configuration, Excel for product data
- **Printing**: ZPL (Zebra Programming Language) via zebra library

### Key Dependencies

| Package    | Version | Purpose                   |
| ---------- | ------- | ------------------------- |
| Eel        | 0.14.0  | Desktop app framework     |
| pandas     | 2.2.3   | Excel file processing     |
| simplejson | 3.19.3  | JSON handling             |
| zebra      | 0.1.0   | ZPL printer communication |
| zplgrf     | 1.6.0   | Image to ZPL conversion   |

### File Structure

```
Prima Wrap Product Label Printing v4/
├── label.py                 # Main application entry point
├── requirements.txt         # Python dependencies
├── README.md               # This file
└── web/                    # Frontend application
    ├── label.html          # Main HTML interface
    ├── css/label.css       # Stylesheets
    ├── js/
    │   ├── label.js        # Main JavaScript logic
    │   └── zpl_images.js   # ZPL image definitions
    ├── db/
    │   ├── config.db       # SQLite configuration database
    │   └── db.xlsx         # Product database
    ├── assets/
    │   ├── custom/         # Custom images for labels
    │   ├── configurations/ # Printer configuration files
    │   └── presentation/   # Documentation and presentations
    └── libs/               # Third-party libraries
```

## ⚙️ Configuration

### Database Setup

1. **Product Database**: Place your Excel file in `web/db/` directory
2. **Configuration**: The app uses SQLite database for settings
3. **Custom Images**: Add PNG files to `web/assets/custom/`

### Printer Configuration

The application automatically detects available printers. For optimal performance:

1. **Calibrate Media**: Use the settings panel to calibrate your printer
2. **Test Configuration**: Print a configuration label to verify settings
3. **Factory Defaults**: Reset to factory settings if needed

## 🔍 Troubleshooting

### Common Issues

**Application won't start**

- Ensure Python 3.13.0 is installed
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Check that at least one printer is available on the system

**No printers detected**

- Install a virtual printer like "Print to PDF" if no physical printer is available
- Restart the application after adding printers
- Check Windows printer settings

**Database connection errors**

- Verify Excel file exists in `web/db/` directory
- Ensure Excel file has the correct format (Sheet 2 should contain product data)
- Check file permissions

**Printing issues**

- Verify printer is selected in the dropdown
- Check printer is online and has paper
- Use "Calibrate Media" in settings if labels are misaligned

### Debug Mode

For advanced troubleshooting, check the browser console (F12) for JavaScript errors and the Python console for backend issues.

## 🤝 Contributing

This project was developed specifically for Prima Wrap's needs. However, if you find bugs or have suggestions for improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Prima Wrap**: For providing the real-world use case and feedback
- **CS50**: For the educational foundation that made this project possible
- **Python Eel**: For the excellent desktop app framework
- **Zebra Technologies**: For ZPL documentation and tools

## 📞 Support

For support or questions about this application, please refer to the troubleshooting section above or contact the development team.

---

**Note**: This application is specifically designed for Prima Wrap's inventory management needs. While it may be adaptable for other businesses, it's optimized for their specific workflow and requirements.

_Last updated: December 2024_
