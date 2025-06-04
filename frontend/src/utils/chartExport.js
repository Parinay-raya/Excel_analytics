/**
 * Utility functions for exporting charts as PNG
 */

/**
 * Convert an SVG element to a PNG data URL
 * @param {SVGElement} svgElement - The SVG element to convert
 * @param {Object} options - Options for the conversion
 * @returns {Promise<string>} - A promise that resolves to the PNG data URL
 */
export const svgToPngDataUrl = (svgElement, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const { width = 800, height = 600, backgroundColor = '#FFFFFF' } = options;
      
      // Create a clone of the SVG to avoid modifying the original
      const svgClone = svgElement.cloneNode(true);
      
      // Set width and height attributes if they don't exist
      if (!svgClone.hasAttribute('width')) {
        svgClone.setAttribute('width', width);
      }
      if (!svgClone.hasAttribute('height')) {
        svgClone.setAttribute('height', height);
      }
      
      // Convert SVG to string
      const svgString = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      // Create an Image object to draw the SVG to a canvas
      const img = new Image();
      img.onload = () => {
        // Create a canvas to render the image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        
        // Fill background if specified
        if (backgroundColor) {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, width, height);
        }
        
        // Draw the image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/png');
        
        // Clean up
        URL.revokeObjectURL(svgUrl);
        
        resolve(dataUrl);
      };
      
      img.onerror = (error) => {
        URL.revokeObjectURL(svgUrl);
        reject(new Error('Failed to load SVG as image: ' + error));
      };
      
      img.src = svgUrl;
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Export a chart as a PNG file
 * @param {HTMLElement} chartContainer - The container element of the chart
 * @param {string} fileName - The name of the file to download
 */
export const exportChartAsPng = async (chartContainer, fileName = 'chart') => {
  try {
    // Find the SVG element within the chart container
    const svgElement = chartContainer.querySelector('svg');
    if (!svgElement) {
      throw new Error('No SVG element found in the chart container');
    }
    
    // Get the dimensions of the SVG
    const svgRect = svgElement.getBoundingClientRect();
    const width = svgRect.width;
    const height = svgRect.height;
    
    // Convert SVG to PNG data URL
    const dataUrl = await svgToPngDataUrl(svgElement, { width, height });
    
    // Create a download link
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Failed to export chart as PNG:', error);
    throw error;
  }
};

/**
 * Export a chart as a PDF file (simplified version that just shows a message)
 * @param {HTMLElement} chartContainer - The container element of the chart
 * @param {string} fileName - The name of the file to download
 * @param {Object} options - Options for the PDF
 */
export const exportChartAsPdf = async (chartContainer, fileName = 'chart', options = {}) => {
  try {
    // For now, just export as PNG and show a message
    await exportChartAsPng(chartContainer, fileName);
    
    // Show a message to the user
    alert('PDF export is currently not available. Your chart has been exported as PNG instead.');
  } catch (error) {
    console.error('Failed to export chart:', error);
    throw error;
  }
};

/**
 * Export a DOM element as a PNG file
 * @param {HTMLElement} element - The DOM element to export
 * @param {string} fileName - The name of the file to download
 */
export const exportElementAsPng = async (element, fileName = 'export') => {
  try {
    // Try to find an SVG in the element
    const svgElement = element.querySelector('svg');
    if (svgElement) {
      await exportChartAsPng(element, fileName);
    } else {
      // If no SVG, try to use canvas directly
      const canvas = document.createElement('canvas');
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      
      // Create a data URL from the canvas
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create a download link
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();
    }
  } catch (error) {
    console.error('Failed to export element as PNG:', error);
    throw error;
  }
};

/**
 * Export a DOM element as a PDF file (simplified version that just shows a message)
 * @param {HTMLElement} element - The DOM element to export
 * @param {string} fileName - The name of the file to download
 * @param {Object} options - Options for the PDF
 */
export const exportElementAsPdf = async (element, fileName = 'export', options = {}) => {
  try {
    // For now, just export as PNG and show a message
    await exportElementAsPng(element, fileName);
    
    // Show a message to the user
    alert('PDF export is currently not available. Your chart has been exported as PNG instead.');
  } catch (error) {
    console.error('Failed to export element:', error);
    throw error;
  }
};