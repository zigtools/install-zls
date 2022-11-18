// vscode:extension/AugusteRame.zls-vscode

async function loadInstructions(path) {
    const res = await fetch(`/instructions/${path}`);
    const text = await res.text();
    
    const markdown_as_html = path.endsWith(".md") ? marked.parse(text) : text;
    document.querySelector(".instructions").innerHTML = markdown_as_html;
}

const converter = new showdown.Converter();

// https://stackoverflow.com/questions/64489395/converting-snake-case-string-to-title-case
const titleCase = (s) =>
  s.replace (/^[-_]*(.)/, (_, c) => c.toUpperCase())       // Initial char (after -/_)
   .replace (/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase()) // First char after each -/_

const feature_defaults = {
    auto_installer: false,
    auto_updater: false,
    in_editor_configuration: false,
};

const data = {
    "Visual Studio Code": {
        official: true,
        features: {
            auto_updater: true,
            in_editor_configuration: true,
        },
        install: {
            text: `
To install ZLS for VSCode, simply [install the ZLS for VSCode extension](vscode:extension/AugusteRame.zls-vscode) ([or open in browser](https://marketplace.visualstudio.com/items?itemName=AugusteRame.zls-vscode)).
`,
        }
    },
    "Sublime Text": {
        _: "Which version?",
        "Sublime Text 3": {
            official: false,
            install: {
                text: `
\`\`\`json
{
    "clients": {
        "zig": {
            "command": ["zls"],
            "enabled": true,
            "languageId": "zig",
            "scopes": ["source.zig"],
            "syntaxes": ["Packages/Zig Language/Syntaxes/Zig.tmLanguage"]
        }
    }
}
\`\`\`
`
            }
        },
        "Sublime Text 4": {
            official: false,
            install: {
                text: `\`\`\`
{
    "clients": {
        "zig": {
            "command": ["zls"],
            "enabled": true,
            "selector": "source.zig"
        }
    }
}
\`\`\`
`
            }
        },
    },
    "Neovim / Vim8": {
        _: "Which language client extension are you using?",
        CoC: {
            _: "Extension or manual?",
            Extension: {
                official: false,
                features: {
                    auto_updater: false,
                    auto_installer: true,
                    in_editor_configuration: true,
                },
                install: {
                    text: `Run \`:CocInstall coc-zls\` to install [coc-zls](https://github.com/xiyaowong/coc-zls),
                    this extension supports the same functionality as the VS Code extension.`
                }
            },
            "Manually register": {
                official: false,
                features: {},
                install: {
                    text: `
\`\`\`json
{
    "languageserver": {
        "zls" : {
            "command": "command_or_path_to_zls",
            "filetypes": ["zig"]
        }
    }
}
\`\`\`
`
                }
            }
        },
        YouCompleteMe: {
            official: false,
            features: {},
            install: {
                text: `
- Install YouCompleteMe from [here](https://github.com/ycm-core/YouCompleteMe.git).
- Add these lines to your vimrc:

\`\`\`vim
"ensure zig is a recognized filetype
autocmd BufNewFile,BufRead *.zig set filetype=zig
let g:ycm_language_server =
    \\ [
    \\{
    \\     'name': 'zls',
    \\     'filetypes': [ 'zig' ],
    \\     'cmdline': [ '/path/to/zls_executable' ]
    \\    }
    \\ ]
\`\`\`
                `
            }
        },
        "nvim-lspconfig": {
            official: false,
            features: {},
            install: {
                text: `
Requires Nvim 0.5 (HEAD)!

- Install nvim-lspconfig from [here](https://github.com/neovim/nvim-lspconfig).
- Install zig.vim from [here](https://github.com/ziglang/zig.vim).

nvim-lspconfig already ships a configuration for zls. A simple \`init.vim\` might look like this:
\`\`\`vim
call plug#begin('~/.config/nvim/plugged')
Plug 'neovim/nvim-lspconfig'
Plug 'nvim-lua/completion-nvim'
Plug 'ziglang/zig.vim'
call plug#end()
:lua << EOF
    local lspconfig = require('lspconfig')
    local on_attach = function(_, bufnr)
        vim.api.nvim_buf_set_option(bufnr, 'omnifunc', 'v:lua.vim.lsp.omnifunc')
        require('completion').on_attach()
    end
    local servers = {'zls'}
    for _, lsp in ipairs(servers) do
        lspconfig[lsp].setup {
            on_attach = on_attach,
        }
    end
EOF
" Set completeopt to have a better completion experience
set completeopt=menuone,noinsert,noselect
" Enable completions as you type
let g:completion_enable_auto_popup = 1
\`\`\`
                `
            }
        },
        "LanguageClient-neovim": {
            official: false,
            features: {},
            install: {
                text: `
- Install the LanguageClient-neovim from [here](https://github.com/autozimu/LanguageClient-neovim).
- Edit your neovim configuration and add \`zls\` for zig filetypes:

\`\`\`vim
let g:LanguageClient_serverCommands = {
        \\ 'zig': ['~/code/zls/zig-out/bin/zls'],
        \\ }
\`\`\`
                `
            }
        },
    },
    "Kate": {
        official: false,
        features: {},
        install: {
            text: `
- Install language support for Zig from [here](https://github.com/ziglang/kde-syntax-highlighting).
- Enable \`LSP client\` plugin in Kate settings.
- Add this snippet to \`LSP client's\` user settings (e.g. \`/$HOME/.config/kate/lspclient\`)
    (or paste it in \`LSP client's\` GUI settings)

\`\`\`json
{
    "servers": {
        "zig": {
            "command": ["zls"],
            "url": "https://github.com/zigtools/zls",
            "highlightingModeRegex": "^Zig$"
        }
    }
}
\`\`\`
            `
        }
    },
    Emacs: {
        official: false,
        features: {},
        install: {
            text: `
- Install [lsp-mode](https://github.com/emacs-lsp/lsp-mode) from melpa.
- [zig mode](https://github.com/ziglang/zig-mode) is also useful.

\`\`\`elisp
;; Setup lsp-mode as desired.
;; See https://emacs-lsp.github.io/lsp-mode/page/installation/ for more information.
(require 'lsp-mode)
;; Either place zls in your PATH or add the following:
(setq lsp-zig-zls-executable "<path to zls>")
\`\`\`
            `
        }
    },
    "Doom Emacs": {
        official: false,
        features: {},
        install: {
            text: `
- Enable the \`lsp\` module.
- Install the [zig-mode](https://github.com/ziglang/zig-mode) package (add \`(package! zig-mode)\` to your \`packages.el\` file.
- Add the following to your \`config.el\`:

\`\`\`elisp
(use-package! zig-mode
  :hook ((zig-mode . lsp-deferred))
  :custom (zig-format-on-save nil)
  :config
  (after! lsp-mode
    (add-to-list 'lsp-language-id-configuration '(zig-mode . "zig"))
    (lsp-register-client
      (make-lsp-client
        :new-connection (lsp-stdio-connection "<path to zls>")
        :major-modes '(zig-mode)
        :server-id 'zls))))
\`\`\`
            `
        }
    },
    "Spacemacs": {
        official: false,
        features: {},
        install: {
            text: `
- Add \`lsp\` and \`zig\` to \`dotspacemacs-configuration-layers\` in your \`.spacemacs\` file.
- If you don't have \`zls\` in your \`PATH\`, add the following to \`dotspacemacs/user-config\` in your
  \`.spacemacs\` file:

\`\`\`elisp
(setq lsp-zig-zls-executable "<path to zls>")
\`\`\`
            `
        }
    },
    "Helix": {
        official: false,
        features: {},
        install: {
            text: `
- Just add \`zls\` to your \`PATH\`.
- run \`hx --health\` to check if helix found \`zls\`.
            `
        }
    },
    "Other": {
        _: "How would you like to get zls?",
        "Binaries": {
            _: "Which binaries would you like?",
            "Latest (Recommended)": {
                official: true,
                features: {},
                install: {
                    text: `
To install the latest build artifacts, click on the (hopefully) green checkmark on the latest master commit, then on \`Details\`, then on \`Summary\`. Finally, scroll down and click on \`builds\` - this'll contain all the release binaries our CI builds. 
                    `,
                }
            },
            "Release": {
                official: true,
                features: {},
                install: {
                    text: `
Just head to the [\`Releases\`](https://github.com/zigtools/zls/releases) tab and select the right executable in the \`Assets\` section at the bottom of the latest release.
                    `,
                }
            }
        },
        "From Source": {
            official: true,
            features: {},
            install: {
                text: `
[See the \`From Source\` README section](https://github.com/zigtools/zls/blob/master/README.md#from-source).
                `,
            }
        }
    }
}

const editors_elem = document.querySelector(".main__slots>*:nth-child(2)");

for (const editor in data) {
    const editor_elem = document.createElement("span");
    editor_elem.setAttribute("data-name", editor);
    editor_elem.innerText = titleCase(editor);
    editors_elem.appendChild(editor_elem);
}

document.addEventListener("click", event => {
    const ssl = event.target.closest(".single-select-list>*");
    if (ssl) {
        document.querySelector(".main__instructions_header").innerHTML = "";
        [...ssl.parentElement.querySelectorAll(".selected")].map(_ => _.classList.remove("selected"));
        ssl.classList.add("selected");

        [...document.querySelectorAll(".info *")].map(_ => _.textContent = "");

        const dn = ssl.getAttribute("data-name");
        let datum = data;

        [...document.querySelectorAll(`.main__slots>*:nth-child(n+${2*dn.split(".").length+1})`)].map(_ => _.remove());

        for (const sec of dn.split(".")) datum = datum[sec];

        if ("official" in datum) {
            document.querySelector(".main__instructions_header").innerHTML = "Instructions";

            const chk = document.querySelector(".info__features__checklist");
            chk.innerHTML = "";

            const f = {official: datum.official, ...feature_defaults, ...datum.features};
            for (const feature in f) {
                const feature_elem = document.createElement("span");
                feature_elem.innerHTML = `<span class=${f[feature] ? "yes" : "no"}>${f[feature] ? "✓" : "✗"}</span> <span>${titleCase(feature)}</span>`;
                chk.appendChild(feature_elem);
            }

            document.querySelector(".info__install").innerHTML = converter.makeHtml(datum.install.text);

            // if (datum.install?.links) {
            //     const links_elem = document.querySelector(".info__links");

            //     for (const link of datum.install?.links) {
            //         const link_elem = document.createElement("a");
            //         link_elem.href = link.href;
            //         link_elem.innerHTML = link.text;
            //         links_elem.appendChild(link_elem);
            //     }
            // }
        } else {
            const header_elem = document.createElement("h2");
            header_elem.innerText = datum._;
            document.querySelector(".main__slots").appendChild(header_elem);

            const sub_elem = document.createElement("div");
            sub_elem.classList.add("single-select-list");

            for (const editor in datum) {
                if (editor === "_") continue;
                const editor_elem = document.createElement("span");
                editor_elem.setAttribute("data-name", `${dn}.${editor}`);
                editor_elem.innerText = editor;
                sub_elem.appendChild(editor_elem);
            }

            document.querySelector(".main__slots").appendChild(sub_elem);
        }
    }
});
