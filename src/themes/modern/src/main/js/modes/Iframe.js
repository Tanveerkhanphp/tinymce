/**
 * Iframe.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.modern.modes.Iframe',
  [
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.ui.Factory',
    'tinymce.core.util.Tools',
    'tinymce.themes.modern.ui.A11y',
    'tinymce.themes.modern.ui.Branding',
    'tinymce.themes.modern.ui.ContextToolbars',
    'tinymce.themes.modern.ui.Menubar',
    'tinymce.themes.modern.ui.Resize',
    'tinymce.themes.modern.ui.Sidebar',
    'tinymce.themes.modern.ui.SkinLoaded',
    'tinymce.themes.modern.ui.Toolbar'
  ],
  function (DOMUtils, Factory, Tools, A11y, Branding, ContextToolbars, Menubar, Resize, Sidebar, SkinLoaded, Toolbar) {
    var DOM = DOMUtils.DOM;

    var switchMode = function (panel) {
      return function (e) {
        panel.find('*').disabled(e.mode === 'readonly');
      };
    };

    var editArea = function (border) {
      return {
        type: 'panel',
        name: 'iframe',
        layout: 'stack',
        classes: 'edit-area',
        border: border,
        html: ''
      };
    };

    var editAreaContainer = function (editor) {
      return {
        type: 'panel',
        layout: 'stack',
        classes: 'edit-aria-container',
        border: '1 0 0 0',
        items: [
          editArea('0'),
          Sidebar.createSidebar(editor)
        ]
      };
    };

    var render = function (editor, theme, args) {
      var panel, resizeHandleCtrl, startSize, settings = editor.settings;

      if (args.skinUiCss) {
        DOM.styleSheetLoader.load(args.skinUiCss, SkinLoaded.fireSkinLoaded(editor));
      }

      panel = theme.panel = Factory.create({
        type: 'panel',
        role: 'application',
        classes: 'tinymce',
        style: 'visibility: hidden',
        layout: 'stack',
        border: 1,
        items: [
          settings.menubar === false ? null : { type: 'menubar', border: '0 0 1 0', items: Menubar.createMenuButtons(editor) },
          Toolbar.createToolbars(editor, settings.toolbar_items_size),
          Sidebar.hasSidebar(editor) ? editAreaContainer(editor) : editArea('1 0 0 0')
        ]
      });

      if (settings.resize !== false) {
        resizeHandleCtrl = {
          type: 'resizehandle',
          direction: settings.resize,

          onResizeStart: function () {
            var elm = editor.getContentAreaContainer().firstChild;

            startSize = {
              width: elm.clientWidth,
              height: elm.clientHeight
            };
          },

          onResize: function (e) {
            if (settings.resize === 'both') {
              Resize.resizeTo(editor, startSize.width + e.deltaX, startSize.height + e.deltaY);
            } else {
              Resize.resizeTo(editor, null, startSize.height + e.deltaY);
            }
          }
        };
      }

      // Add statusbar if needed
      if (settings.statusbar !== false) {
        panel.add({
          type: 'panel', name: 'statusbar', classes: 'statusbar', layout: 'flow', border: '1 0 0 0', ariaRoot: true, items: [
            { type: 'elementpath', editor: editor },
            resizeHandleCtrl
          ]
        });
      }

      editor.fire('BeforeRenderUI');
      editor.on('SwitchMode', switchMode(panel));
      panel.renderBefore(args.targetNode).reflow();

      if (settings.readonly) {
        editor.setMode('readonly');
      }

      if (args.width) {
        DOM.setStyle(panel.getEl(), 'width', args.width);
      }

      // Remove the panel when the editor is removed
      editor.on('remove', function () {
        panel.remove();
        panel = null;
      });

      // Add accesibility shortcuts
      A11y.addKeys(editor, panel);
      ContextToolbars.addContextualToolbars(editor);
      Branding.setup(editor);

      return {
        iframeContainer: panel.find('#iframe')[0].getEl(),
        editorContainer: panel.getEl()
      };
    };

    return {
      render: render
    };
  }
);
