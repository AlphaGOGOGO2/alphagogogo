import { useState, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  AccessibilityHelp,
  Autoformat,
  AutoImage,
  Autosave,
  Bold,
  Essentials,
  FindAndReplace,
  Heading,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  Paragraph,
  SelectAll,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
  Base64UploadAdapter
} from "ckeditor5";
import { Label } from "@/components/ui/label";
import { uploadResourceImage } from "@/services/resourceMediaService";
import { toast } from "sonner";

import "ckeditor5/ckeditor5.css";

interface ResourceCKEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ResourceCKEditor({ value, onChange, placeholder }: ResourceCKEditorProps) {
  const [isReady, setIsReady] = useState(false);
  const editorRef = useRef<any>(null);

  // CKEditor 설정
  const editorConfig = {
    toolbar: {
      items: [
        'undo',
        'redo',
        '|',
        'findAndReplace',
        'selectAll',
        '|',
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        'link',
        'insertImage',
        'insertTable',
        '|',
        'bulletedList',
        'numberedList',
        'todoList',
        '|',
        'accessibilityHelp'
      ],
      shouldNotGroupWhenFull: false
    },
    plugins: [
      AccessibilityHelp,
      Autoformat,
      AutoImage,
      Autosave,
      Bold,
      Essentials,
      FindAndReplace,
      Heading,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsert,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      Paragraph,
      SelectAll,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      TodoList,
      Underline,
      Undo,
      Base64UploadAdapter
    ],
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
      ]
    },
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:inline',
        'imageStyle:wrapText',
        'imageStyle:breakText',
        '|',
        'resizeImage'
      ]
    },
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://',
      decorators: {
        toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {
            download: 'file'
          }
        }
      }
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true
      }
    },
    placeholder: placeholder || '자료에 대한 상세한 설명을 작성해주세요...',
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
    }
  } as any; // 타입 캐스팅으로 TypeScript 오류 회피

  // 이미지 업로드 어댑터
  class SupabaseUploadAdapter {
    private loader: any;

    constructor(loader: any) {
      this.loader = loader;
    }

    upload() {
      return this.loader.file.then((file: File) => {
        return new Promise(async (resolve, reject) => {
          try {
            const imageUrl = await uploadResourceImage(file);
            if (imageUrl) {
              resolve({
                default: imageUrl
              });
            } else {
              reject('업로드에 실패했습니다.');
            }
          } catch (error) {
            console.error('Image upload error:', error);
            reject('업로드 중 오류가 발생했습니다.');
          }
        });
      });
    }

    abort() {
      // 업로드 취소 로직 (필요시)
    }
  }

  // 업로드 어댑터 플러그인
  function uploaderPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new SupabaseUploadAdapter(loader);
    };
  }

  const handleReady = (editor: any) => {
    editorRef.current = editor;
    setIsReady(true);
    
    // 업로드 어댑터 설정
    uploaderPlugin(editor);
  };

  const handleChange = (event: any, editor: any) => {
    const data = editor.getData();
    onChange(data);
  };

  const handleError = (error: any) => {
    console.error('CKEditor error:', error);
    toast.error('에디터 로딩 중 오류가 발생했습니다.');
  };

  return (
    <div>
      <Label className="text-lg font-semibold text-gray-800 mb-3 block">설명</Label>
      <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all">
        <CKEditor
          editor={ClassicEditor}
          config={editorConfig}
          data={value}
          onReady={handleReady}
          onChange={handleChange}
          onError={handleError}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        자료에 대한 상세한 설명을 작성해주세요. 헤딩, 리스트, 이미지, 테이블 등을 사용할 수 있습니다.
      </p>
    </div>
  );
}
