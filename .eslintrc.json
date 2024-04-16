{
	"root": true,
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-type-checked"
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"project": ["./tsconfig.eslint.json"]
	},
	"rules": {
		"@typescript-eslint/member-ordering": [
			"error",
			{
				"default": {
					"memberTypes": [
						"signature",
						"call-signature",
						"private-accessor",
						"#private-accessor",
						"protected-accessor",
						"public-accessor",
						"public-field",
						"protected-field",
						"private-field",
						"private-readonly-field",
						"protected-readonly-field",
						"public-readonly-field",
						"private-static-field",
						"protected-static-field",
						"public-static-field",
						"constructor",
						"public-get",
						"protected-get",
						"private-get",
						"abstract-get",
						"public-set",
						"protected-set",
						"private-set",
						"abstract-set",
						"public-static-get",
						"protected-static-get",
						"private-static-get",
						"public-static-set",
						"protected-static-set",
						"private-static-set",
						"public-method",
						"protected-method",
						"private-method",
						"public-abstract-method",
						"protected-abstract-method",
						"public-static-method",
						"protected-static-method",
						"private-static-method"
					],
					"order": "natural-case-insensitive"
				}
			}
		],
		"comma-dangle": ["error", "always-multiline"],
		"indent": [
			"error",
			"tab",
			{
				"ignoredNodes": ["TemplateLiteral > *"],
				"ImportDeclaration": 1
			}
		],
		"max-len": [
			"warn",
			79,
			{
				"ignoreTemplateLiterals": true
			}
		],
		"object-curly-newline": [
			"error",
			{
				"ImportDeclaration": "always"
			}
		],
		"operator-linebreak": [
			"error",
			"after",
			{
				"overrides": {
					"?": "before",
					":": "before",
					"&&": "before",
					"||": "before"
				}
			}
		],
		"sort-imports": [
			"error",
			{
				"ignoreCase": true,
				"ignoreDeclarationSort": true,
				"ignoreMemberSort": false,
				"memberSyntaxSortOrder": ["none", "all", "single", "multiple"]
			}
		]
	}
}
