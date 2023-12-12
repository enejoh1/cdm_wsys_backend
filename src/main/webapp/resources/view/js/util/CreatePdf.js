Ext.define('Msys.util.CreatePdf', {
    initComponent: function(p1, p2) {
        console.log('====== Msys.util.CreatePdf =======');
        console.log('===== p1', p1);
        console.log('===== p2', p2);
    },
    setContent: function(content) {
        this.content = content;
    },
    setStyles: function(styles) {
        this.styles = styles;
    },
    setPageSize: function(pageSize) {
        if(pageSize==null) pageSize = 'A4';
        this.pageSize = pageSize;
    },
    setPageOrientation: function(pageOrientation) {
        if(pageOrientation==null) pageOrientation = 'portrait';
        this.pageOrientation = pageOrientation;
    },
    setPdfName: function(pdf_name) {
        this.pdf_name = pdf_name + '.pdf';
    },
    createPdf: function() {
        if(this.pdf_name==null || this.pdf_name.length<1) {
            Ext.MessageBox.alert('알림', 'PDF 파일명을 지정해주세요.');
            return null;
        };
        if(this.content==null || this.content.length<1) {
            Ext.MessageBox.alert('알림', 'PDF 내용을 확인해주세요.');
            return null;
        };
        if(this.styles==null || this.styles.length<1) {
            Ext.MessageBox.alert('알림', 'PDF Style을 확인해주세요.');
            return null;
        };

        this.document = {
            content:this.content,
            footer:this.footer,
            styles:this.styles,
            pageSize:this.pageSize,
            pageOrientation:this.pageOrientation
        }
        pdfMake.createPdf(this.document).download(this.pdf_name);
    }
});