import zipfile
import xml.etree.ElementTree as ET
import sys

def extract_text(docx_filename):
    with zipfile.ZipFile(docx_filename) as docx:
        xml_content = docx.read('word/document.xml')
        tree = ET.XML(xml_content)
        
        WORD_NAMESPACE = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
        PARA = WORD_NAMESPACE + 'p'
        TEXT = WORD_NAMESPACE + 't'
        
        text = []
        for paragraph in tree.iter(PARA):
            texts = [node.text for node in paragraph.iter(TEXT) if node.text]
            if texts:
                text.append(''.join(texts))
        return '\n'.join(text)

if __name__ == "__main__":
    if len(sys.argv) > 2:
        with open(sys.argv[2], "w", encoding="utf-8") as f:
            f.write(extract_text(sys.argv[1]))
        print(f"Successfully wrote to {sys.argv[2]}")
    else:
        print("Usage: python read_docx.py <input.docx> <output.txt>")
