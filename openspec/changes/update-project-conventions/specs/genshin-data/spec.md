## ADDED Requirements

### Requirement: Code Comment Language Standards
The project SHALL enforce consistent comment language standards across all code files.

#### Scenario: Backend Go code comments
- **WHEN** writing or modifying Go code in the `genshindata/` directory
- **THEN** all comments MUST be in Chinese (中文)
- **AND** comments should be clear, concise, and explain the "why" rather than the "what"

#### Scenario: Frontend code comments
- **WHEN** writing or modifying TypeScript/HTML/CSS code in the `src/app/` directory
- **THEN** all comments MUST be in Japanese (日文)
- **AND** comments should follow Angular style guide conventions

#### Scenario: Comment translation for existing code
- **WHEN** refactoring existing code that violates the comment language standards
- **THEN** comments SHALL be translated to the correct language (Chinese for Go, Japanese for frontend)
- **AND** the meaning and intent of the original comment MUST be preserved

#### Scenario: Specific frontend files requiring correction
- **WHEN** correcting Chinese comments in existing frontend code from previous proposals
- **THEN** only the following files SHALL be corrected:
  - `src/app/shared/service/hyperlink.service.ts`
  - `src/app/shared/component/hyperlink/hyperlink.component.ts`
  - `src/app/shared/component/hyperlink-tooltip/hyperlink-tooltip.component.ts`
  - `src/app/shared/directive/hyperlink.directive.ts`
  - `src/app/shared/pipe/hyperlink.pipe.ts`
  - `src/app/shared/directive/hyperlink-interaction.directive.ts`
- **AND** all other frontend files SHALL be left unchanged unless they contain non-Japanese comments

### Requirement: Testing Workflow
The project SHALL use code review as the primary quality assurance method instead of automated tests.

#### Scenario: No permanent test code
- **WHEN** implementing new features or fixing bugs
- **THEN** no permanent test code SHALL be written
- **AND** quality assurance relies on thorough code review

#### Scenario: Temporary testing code
- **WHEN** temporary test code is needed for debugging or validation
- **THEN** the code MUST be explicitly marked as temporary
- **AND** the temporary test code MUST be deleted after validation is complete
- **AND** no temporary test code SHALL be committed to the main branch

#### Scenario: Code review requirements
- **WHEN** code changes are proposed
- **THEN** all changes MUST undergo code review
- **AND** the review MUST verify correctness, style compliance, and comment language standards

### Requirement: Project Documentation Structure
The project SHALL maintain project conventions and workflow documentation in a consolidated manner.

#### Scenario: Single source of truth
- **WHEN** developers need to reference project conventions or workflow information
- **THEN** all essential information SHALL be found in `openspec/project.md`
- **AND** `openspec/workflow-guide.md` SHALL NOT exist (content consolidated into project.md)
- **AND** `openspec/AGENTS.md` SHALL remain as the authoritative guide for AI assistants

#### Scenario: Documentation consolidation
- **WHEN** consolidating workflow documentation
- **THEN** core OpenSpec workflow concepts from `workflow-guide.md` SHALL be integrated into `project.md`
- **AND** the consolidated documentation SHALL maintain clarity and usability
- **AND** redundant files SHALL be removed

#### Scenario: Documentation updates
- **WHEN** project conventions or workflows change
- **THEN** updates SHALL be made to `openspec/project.md`
- **AND** no separate workflow guide files SHALL be created

## MODIFIED Requirements

### Requirement: Project Conventions Compliance
All code and documentation in the project SHALL comply with the documented conventions in `openspec/project.md`.

#### Scenario: Tech stack version accuracy
- **WHEN** `project.md` lists technology versions (Angular, TypeScript, Go, etc.)
- **THEN** the versions SHALL match the actual versions in package.json and go.mod files
- **AND** discrepancies SHALL be corrected through the update process

#### Scenario: Architecture description accuracy
- **WHEN** `project.md` describes project architecture patterns
- **THEN** the description SHALL accurately reflect the actual codebase structure
- **AND** architectural changes SHALL be documented in project.md

#### Scenario: Comment language compliance
- **WHEN** reviewing code for compliance
- **THEN** Go code comments MUST be in Chinese
- **AND** frontend code comments MUST be in Japanese
- **AND** violations SHALL be corrected

#### Scenario: Documentation completeness
- **WHEN** reviewing project documentation
- **THEN** `project.md` SHALL contain all essential project conventions
- **AND** workflow information SHALL be consolidated in `project.md`
- **AND** redundant documentation files SHALL NOT exist
