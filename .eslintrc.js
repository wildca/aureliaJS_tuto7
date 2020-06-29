module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    extends: [
        "plugin:@typescript-eslint/recommended" // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    ],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: "module" // Allows for the use of imports
    },
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        "linebreak-style": ["error", "unix"],
        "max-len": ["error", {"code": 100, "ignoreUrls": true, "ignoreStrings": true}],
        /**
         * Strict mode
         */
        // babel inserts "use strict"; for us
        "strict": [
            "error",
            "never"
        ], // http://eslint.org/docs/rules/strict
        /**
         * ES6
         */
        "no-var": ["error"], // http://eslint.org/docs/rules/no-var
        "prefer-const": 0, // http://eslint.org/docs/rules/prefer-const
        /**
         * Variables
         */
        "no-shadow": ["error"], // http://eslint.org/docs/rules/no-shadow
        "no-shadow-restricted-names": ["error"], // http://eslint.org/docs/rules/no-shadow-restricted-names
        "no-unused-vars": [
            "error",
            { // http://eslint.org/docs/rules/no-unused-vars
                "vars": "local",
                "args": "none"
            }
        ],
        "no-use-before-define": ["error", { "functions": false }], // http://eslint.org/docs/rules/no-use-before-define
        /**
         * Possible errors
         */
        "comma-dangle": [
            "error",
            "always-multiline"
        ], // http://eslint.org/docs/rules/comma-dangle
        "no-cond-assign": [
            "error",
            "always"
        ], // http://eslint.org/docs/rules/no-cond-assign
        "no-console": ["error"], // http://eslint.org/docs/rules/no-console
        "no-debugger": ["error"], // http://eslint.org/docs/rules/no-debugger
        "no-alert": ["error"], // http://eslint.org/docs/rules/no-alert
        "no-constant-condition": ["error"], // http://eslint.org/docs/rules/no-constant-condition
        "no-dupe-keys": ["error"], // http://eslint.org/docs/rules/no-dupe-keys
        "no-duplicate-case": ["error"], // http://eslint.org/docs/rules/no-duplicate-case
        "no-empty": ["error"], // http://eslint.org/docs/rules/no-empty
        "no-ex-assign": ["error"], // http://eslint.org/docs/rules/no-ex-assign
        "no-extra-boolean-cast": ["error"], // http://eslint.org/docs/rules/no-extra-boolean-cast
        "no-extra-semi": ["error"], // http://eslint.org/docs/rules/no-extra-semi
        "no-func-assign": ["error"], // http://eslint.org/docs/rules/no-func-assign
        "no-inner-declarations": ["error"], // http://eslint.org/docs/rules/no-inner-declarations
        "no-invalid-regexp": ["error"], // http://eslint.org/docs/rules/no-invalid-regexp
        "no-irregular-whitespace": ["error"], // http://eslint.org/docs/rules/no-irregular-whitespace
        "no-obj-calls": ["error"], // http://eslint.org/docs/rules/no-obj-calls
        "no-sparse-arrays": ["error"], // http://eslint.org/docs/rules/no-sparse-arrays
        "no-unreachable": ["error"], // http://eslint.org/docs/rules/no-unreachable
        "use-isnan": ["error"], // http://eslint.org/docs/rules/use-isnan
        "block-scoped-var": ["error"], // http://eslint.org/docs/rules/block-scoped-var
        /**
         * Best practices
         */
        "consistent-return": ["error"], // http://eslint.org/docs/rules/consistent-return
        "curly": [
            "error",
            "multi-line"
        ], // http://eslint.org/docs/rules/curly
        "default-case": ["error"], // http://eslint.org/docs/rules/default-case
        "dot-notation": [
            "error",
            { // http://eslint.org/docs/rules/dot-notation
                "allowKeywords": true
            }
        ],
        "eqeqeq": ["error"], // http://eslint.org/docs/rules/eqeqeq
        "guard-for-in": ["error"], // http://eslint.org/docs/rules/guard-for-in
        "no-caller": ["error"], // http://eslint.org/docs/rules/no-caller
        "no-else-return": ["error"], // http://eslint.org/docs/rules/no-else-return
        "no-eq-null": ["error"], // http://eslint.org/docs/rules/no-eq-null
        "no-eval": ["error"], // http://eslint.org/docs/rules/no-eval
        "no-extend-native": ["error"], // http://eslint.org/docs/rules/no-extend-native
        "no-extra-bind": ["error"], // http://eslint.org/docs/rules/no-extra-bind
        "no-fallthrough": ["error"], // http://eslint.org/docs/rules/no-fallthrough
        "no-floating-decimal": ["error"], // http://eslint.org/docs/rules/no-floating-decimal
        "no-implied-eval": ["error"], // http://eslint.org/docs/rules/no-implied-eval
        "no-lone-blocks": ["error"], // http://eslint.org/docs/rules/no-lone-blocks
        "no-loop-func": ["error"], // http://eslint.org/docs/rules/no-loop-func
        "no-multi-str": ["error"], // http://eslint.org/docs/rules/no-multi-str
        "no-native-reassign": ["error"], // http://eslint.org/docs/rules/no-native-reassign
        "no-new": ["error"], // http://eslint.org/docs/rules/no-new
        "no-new-func": ["error"], // http://eslint.org/docs/rules/no-new-func
        "no-new-wrappers": ["error"], // http://eslint.org/docs/rules/no-new-wrappers
        "no-octal": ["error"], // http://eslint.org/docs/rules/no-octal
        "no-octal-escape": ["error"], // http://eslint.org/docs/rules/no-octal-escape
        "no-param-reassign": 0, // http://eslint.org/docs/rules/no-param-reassign
        "no-proto": ["error"], // http://eslint.org/docs/rules/no-proto
        "no-redeclare": ["error"], // http://eslint.org/docs/rules/no-redeclare
        "no-return-assign": ["off"], // http://eslint.org/docs/rules/no-return-assign
        "no-script-url": ["error"], // http://eslint.org/docs/rules/no-script-url
        "no-self-compare": ["error"], // http://eslint.org/docs/rules/no-self-compare
        "no-sequences": ["error"], // http://eslint.org/docs/rules/no-sequences
        "no-throw-literal": ["error"], // http://eslint.org/docs/rules/no-throw-literal
        "no-with": ["error"], // http://eslint.org/docs/rules/no-with
        "radix": ["error"], // http://eslint.org/docs/rules/radix
        "vars-on-top": ["error"], // http://eslint.org/docs/rules/vars-on-top
        "wrap-iife": [
            "error",
            "any"
        ], // http://eslint.org/docs/rules/wrap-iife
        "yoda": ["error"], // http://eslint.org/docs/rules/yoda
        /**
         * Style
         */
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1
            }
        ], // http://eslint.org/docs/rules/indent
        "brace-style": [
            "error", // http://eslint.org/docs/rules/brace-style
            "1tbs",
            {
                "allowSingleLine": true
            }
        ],
        "quotes": [
            "error",
            "single",
            "avoid-escape" // http://eslint.org/docs/rules/quotes
        ],
        "camelcase": [
            "error",
            { // http://eslint.org/docs/rules/camelcase
                "properties": "never"
            }
        ],
        "comma-spacing": [
            "error",
            { // http://eslint.org/docs/rules/comma-spacing
                "before": false,
                "after": true
            }
        ],
        "comma-style": [
            "error",
            "last"
        ], // http://eslint.org/docs/rules/comma-style
        "eol-last": ["error"], // http://eslint.org/docs/rules/eol-last
        "func-names": 0, // http://eslint.org/docs/rules/func-names
        "key-spacing": [
            "error",
            { // http://eslint.org/docs/rules/key-spacing
                "beforeColon": false,
                "afterColon": true
            }
        ],
        "new-cap": [
            "error",
            { // http://eslint.org/docs/rules/new-cap
                "newIsCap": true
            }
        ],
        "no-multiple-empty-lines": [
            "error",
            { // http://eslint.org/docs/rules/no-multiple-empty-lines
                "max": 2
            }
        ],
        "no-nested-ternary": ["error"], // http://eslint.org/docs/rules/no-nested-ternary
        "no-new-object": ["error"], // http://eslint.org/docs/rules/no-new-object
        "no-spaced-func": ["error"], // http://eslint.org/docs/rules/no-spaced-func
        "no-trailing-spaces": ["error"], // http://eslint.org/docs/rules/no-trailing-spaces
        "no-extra-parens": [
            "error",
            "functions"
        ], // http://eslint.org/docs/rules/no-extra-parens
        "no-underscore-dangle": 0, // http://eslint.org/docs/rules/no-underscore-dangle
        "one-var": [
            "error",
            "never"
        ], // http://eslint.org/docs/rules/one-var
        "padded-blocks": [
            "error",
            "never"
        ], // http://eslint.org/docs/rules/padded-blocks
        "semi": [
            "error",
            "always"
        ], // http://eslint.org/docs/rules/semi
        "semi-spacing": [
            "error",
            { // http://eslint.org/docs/rules/semi-spacing
                "before": false,
                "after": true
            }
        ],
        "keyword-spacing": ["error"], // http://eslint.org/docs/rules/space-after-keywords
        "space-before-blocks": ["error"], // http://eslint.org/docs/rules/space-before-blocks
        "space-before-function-paren": [
            "error",
            "never"
        ], // http://eslint.org/docs/rules/space-before-function-paren
        "space-infix-ops": ["error"], // http://eslint.org/docs/rules/space-infix-ops
        "spaced-comment": [
            "error",
            "always",
            { // http://eslint.org/docs/rules/spaced-comment
                "exceptions": [
                    "*"
                ],
                "markers": [
                    "*"
                ]
            }
        ],
        "sort-imports": ["error", {
            "ignoreCase": false,
            "ignoreDeclarationSort": true,
            "ignoreMemberSort": false,
            // "memberSyntaxSortOrder": ["none", "all", "single", "multiple"]
        }],
        "no-duplicate-imports": ["error", { "includeExports": true }],
        "no-useless-rename": ["error", {
            "ignoreDestructuring": false,
            "ignoreImport": false,
            "ignoreExport": false
        }],
        "sort-keys": ["off", "asc"],
        /**
         * Typescript stuff.
         */
        "@typescript-eslint/explicit-function-return-type": ["off"],
        "@typescript-eslint/indent": ["error", 4],
        "@typescript-eslint/no-parameter-properties": ["off"],
        "@typescript-eslint/no-use-before-define": ["off"],
    },
};
