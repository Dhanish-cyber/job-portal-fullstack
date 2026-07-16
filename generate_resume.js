const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();
// Save it to the Desktop for easy access
const homeDir = require('os').homedir();
const desktopPath = require('path').join(homeDir, 'Desktop', 'Mohammed_Dhanish_Resume.pdf');

doc.pipe(fs.createWriteStream(desktopPath));

doc.fontSize(25).text('Mohammed Dhanish', { align: 'center' });
doc.moveDown();
doc.fontSize(16).text('Full Stack Developer', { align: 'center' });
doc.moveDown();
doc.fontSize(12).text('Email: dhanish@example.com | Phone: (123) 456-7890 | GitHub: Dhanish-cyber', { align: 'center' });
doc.moveDown(2);

doc.fontSize(14).text('Professional Summary', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).text('Passionate Full Stack Developer with expertise in React, Next.js, and Node.js. Proven ability to build beautiful, responsive, and robust web applications.');
doc.moveDown(1.5);

doc.fontSize(14).text('Experience', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).text('Software Engineer | Tech Innovations (2024 - Present)');
doc.text('• Developed scalable web applications using Next.js and Node.js.');
doc.text('• Implemented secure JWT authentication and RESTful APIs.');
doc.text('• Integrated TailwindCSS and Shadcn-UI for seamless user experiences.');
doc.moveDown(1.5);

doc.fontSize(14).text('Education', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).text('B.S. in Computer Science');
doc.moveDown(1.5);

doc.fontSize(14).text('Skills', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).text('JavaScript, TypeScript, React, Next.js, Node.js, Express, SQLite, Git, TailwindCSS');

doc.end();

console.log('PDF generated at:', desktopPath);
