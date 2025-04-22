import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const ContentPreview = ({ content }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '',
    editable: false,
  });

  // Cleanup editor on unmount
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  // Update content when it changes
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <Box
      sx={{
        '& .ProseMirror': {
          '& p, & h1, & h2, & h3, & ul, & ol': {
            margin: 0,
            fontSize: '0.9rem',
            color: 'text.secondary',
          },
          '& ul, & ol': {
            paddingLeft: 2,
          },
          '& strong': {
            color: 'text.primary',
            fontWeight: 600,
          },
          '& code': {
            backgroundColor: 'action.hover',
            padding: '0.1em 0.2em',
            borderRadius: 0.5,
            fontSize: '0.85em',
          },
          '& blockquote': {
            margin: 0,
            paddingLeft: 1,
            borderLeft: 2,
            borderColor: 'primary.main',
            color: 'text.secondary',
            fontStyle: 'italic',
          },
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.4em',
          height: '2.8em',
          '& *': {
            // Remove any margin/padding that might break the layout
            margin: '0 !important',
            padding: '0 !important',
          }
        }
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  );
};

export default ContentPreview;