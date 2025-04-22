import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Box, IconButton, Tooltip, Divider, Paper } from '@mui/material';
import {
  Title,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  HorizontalRule,
  Code,
  Undo,
  Redo
} from '@mui/icons-material';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const menuItems = [
    {
      icon: <Title />,
      title: 'Heading 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 })
    },
    {
      icon: <FormatBold />,
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold')
    },
    {
      icon: <FormatItalic />,
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic')
    },
    {
      type: 'divider'
    },
    {
      icon: <FormatListBulleted />,
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList')
    },
    {
      icon: <FormatListNumbered />,
      title: 'Numbered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList')
    },
    {
      type: 'divider'
    },
    {
      icon: <FormatQuote />,
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote')
    },
    {
      icon: <Code />,
      title: 'Code Block',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive('codeBlock')
    },
    {
      icon: <HorizontalRule />,
      title: 'Horizontal Line',
      action: () => editor.chain().focus().setHorizontalRule().run()
    },
    {
      type: 'divider'
    },
    {
      icon: <Undo />,
      title: 'Undo',
      action: () => editor.chain().focus().undo().run(),
      isDisabled: () => !editor.can().undo()
    },
    {
      icon: <Redo />,
      title: 'Redo',
      action: () => editor.chain().focus().redo().run(),
      isDisabled: () => !editor.can().redo()
    }
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        gap: 0.5,
        p: 1,
        mb: 2,
        borderBottom: 1,
        borderColor: 'divider',
        flexWrap: 'wrap',
        position: 'sticky',
        top: 0,
        backgroundColor: 'background.paper',
        zIndex: 1
      }}
    >
      {menuItems.map((item, index) => (
        item.type === 'divider' ? (
          <Divider orientation="vertical" flexItem key={`divider-${index}`} />
        ) : (
          <Tooltip key={item.title} title={item.title}>
            <IconButton
              size="small"
              onClick={item.action}
              color={item.isActive?.() ? 'primary' : 'default'}
              disabled={item.isDisabled?.()}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'action.selected'
                }
              }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        )
      ))}
    </Paper>
  );
};

const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Press "/" for commands...'
      })
    ],
    content: content || '',
    editable: true,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        '& .ProseMirror': {
          minHeight: '300px',
          p: 2,
          '&:focus': {
            outline: 'none',
          },
          '& h1': {
            fontSize: '1.75rem',
            fontWeight: 600,
            my: 2,
          },
          '& ul, & ol': {
            pl: 3,
          },
          '& blockquote': {
            borderLeft: 3,
            borderColor: 'primary.main',
            pl: 2,
            ml: 0,
            color: 'text.secondary',
          },
          '& pre': {
            backgroundColor: 'action.hover',
            p: 2,
            borderRadius: 1,
            fontFamily: 'monospace',
          },
          '& p': {
            my: 1,
          },
          '& hr': {
            my: 2,
            border: 'none',
            height: '1px',
            backgroundColor: 'divider',
          }
        }
      }}
    >
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </Box>
  );
};

export default RichTextEditor;