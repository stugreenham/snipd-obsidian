import { App, Modal, Notice } from 'obsidian';
import type SnipdPlugin from './main';
import { DEFAULT_EPISODE_TEMPLATE, DEFAULT_SNIP_TEMPLATE, DEFAULT_EPISODE_FILE_NAME_TEMPLATE } from './types';

export class FormattingConfigModal extends Modal {
  plugin: SnipdPlugin;
  onSave: () => void;
  tempEpisodeTemplate: string;
  tempSnipTemplate: string;
  tempEpisodeFileNameTemplate: string;

  constructor(app: App, plugin: SnipdPlugin, onSave: () => void) {
    super(app);
    this.plugin = plugin;
    this.onSave = onSave;
    this.tempEpisodeTemplate = plugin.settings.episodeTemplate ?? DEFAULT_EPISODE_TEMPLATE;
    this.tempSnipTemplate = plugin.settings.snipTemplate ?? DEFAULT_SNIP_TEMPLATE;
    this.tempEpisodeFileNameTemplate = plugin.settings.episodeFileNameTemplate ?? DEFAULT_EPISODE_FILE_NAME_TEMPLATE;
  }

  onOpen() {
    const { contentEl, modalEl } = this;
    modalEl.addClass('snipd-formatting-modal');
    contentEl.empty();

    const scrollableContent = contentEl.createDiv({ cls: 'snipd-modal-scrollable' });

    scrollableContent.createEl('h2', { text: 'Custom formatting' });
    scrollableContent.createEl('p', {
      text: 'Configure how your episodes and snips are formatted.',
      cls: 'setting-item-description'
    });

    const syntaxDesc = scrollableContent.createDiv({ cls: 'setting-item-description snipd-syntax-description' });
    syntaxDesc.createEl('strong', { text: 'Guide: ' });
    syntaxDesc.appendText('Use ');
    syntaxDesc.createEl('code', { text: '{{variable}}' });
    syntaxDesc.appendText(' to insert content. Add ');
    syntaxDesc.createEl('code', { text: '[[title]]' });
    syntaxDesc.appendText(' after a variable to show a section header when content is available (e.g. ');
    syntaxDesc.createEl('code', { text: '{{snip_note}}[[#### Note]]' });
    syntaxDesc.appendText(' will show "#### Note" followed by the note content if a note exists).');

    // Episode filename
    const fileNameSection = scrollableContent.createDiv({ cls: 'snipd-formatting-section' });
    fileNameSection.createEl('h3', { text: 'Episode page name' });
    this.renderVariablePills(fileNameSection, [
      '{{episode_title}}',
      '{{episode_duration}}',
      '{{episode_publish_date}}',
      '{{episode_url}}'
    ]);
    const fileNameInput = fileNameSection.createEl('input', {
      cls: 'snipd-template-input',
      type: 'text',
    });
    fileNameInput.value = this.tempEpisodeFileNameTemplate;
    fileNameInput.addEventListener('input', () => {
      this.tempEpisodeFileNameTemplate = fileNameInput.value;
    });

    // Episode template
    const episodeSection = scrollableContent.createDiv({ cls: 'snipd-formatting-section' });
    episodeSection.createEl('h3', { text: 'Episode template' });
    this.renderVariablePills(episodeSection, [
      '{{episode_title}}',
      '{{episode_image}}',
      '{{show_title}}',
      '{{show_author}}',
      '{{guests}}',
      '{{episode_publish_date}}',
      '{{episode_ai_description}}',
      '{{mentioned_books}}',
      '{{episode_duration}}',
      '{{episode_url}}',
      '{{show_url}}',
      '{{episode_export_date}}',
      '{{snips_section}}'
    ]);
    const episodeTextarea = episodeSection.createEl('textarea', {
      cls: 'snipd-template-textarea',
    });
    episodeTextarea.value = this.tempEpisodeTemplate;
    episodeTextarea.rows = 10;
    episodeTextarea.addEventListener('input', () => {
      this.tempEpisodeTemplate = episodeTextarea.value;
    });

    // Snip template
    const snipSection = scrollableContent.createDiv({ cls: 'snipd-formatting-section' });
    snipSection.createEl('h3', { text: 'Snip template' });
    this.renderVariablePills(snipSection, [
      '{{snip_title}}',
      '{{snip_url}}',
      '{{snip_tags}}',
      '{{snip_favorite_star}}',
      '{{snip_start_time}}',
      '{{snip_end_time}}',
      '{{snip_clipping_time}}',
      '{{snip_created_time}}',
      '{{snip_duration}}',
      '{{snip_note}}',
      '{{snip_quote}}',
      '{{snip_transcript}}',
      '{{snip_audio_player}}'
    ]);
    const snipTextarea = snipSection.createEl('textarea', {
      cls: 'snipd-template-textarea',
    });
    snipTextarea.value = this.tempSnipTemplate;
    snipTextarea.rows = 10;
    snipTextarea.addEventListener('input', () => {
      this.tempSnipTemplate = snipTextarea.value;
    });

    // Buttons
    const buttonContainer = contentEl.createDiv({ cls: 'modal-button-container' });

    const resetButton = buttonContainer.createEl('button', { text: 'Reset to default' });
    resetButton.addEventListener('click', () => {
      this.tempEpisodeFileNameTemplate = DEFAULT_EPISODE_FILE_NAME_TEMPLATE;
      this.tempEpisodeTemplate = DEFAULT_EPISODE_TEMPLATE;
      this.tempSnipTemplate = DEFAULT_SNIP_TEMPLATE;
      fileNameInput.value = this.tempEpisodeFileNameTemplate;
      episodeTextarea.value = this.tempEpisodeTemplate;
      snipTextarea.value = this.tempSnipTemplate;
    });

    const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
    cancelButton.addEventListener('click', () => {
      this.close();
    });

    const saveButton = buttonContainer.createEl('button', {
      text: 'Save',
      cls: 'mod-cta'
    });
    saveButton.addEventListener('click', () => {
      void (async () => {
        this.plugin.settings.episodeFileNameTemplate =
          this.tempEpisodeFileNameTemplate === DEFAULT_EPISODE_FILE_NAME_TEMPLATE
            ? null
            : this.tempEpisodeFileNameTemplate;
        this.plugin.settings.episodeTemplate =
          this.tempEpisodeTemplate === DEFAULT_EPISODE_TEMPLATE
            ? null
            : this.tempEpisodeTemplate;
        this.plugin.settings.snipTemplate =
          this.tempSnipTemplate === DEFAULT_SNIP_TEMPLATE
            ? null
            : this.tempSnipTemplate;
        await this.plugin.saveSettings();
        this.onSave();
        this.close();
      })();
    });
  }

  private renderVariablePills(container: HTMLElement, vars: string[]) {
    const desc = container.createDiv({ cls: 'snipd-template-variables' });
    desc.setText('Variables (click to copy): ');
    vars.forEach((varName, index) => {
      const span = desc.createSpan({ cls: 'snipd-template-variable', text: varName });
      span.addEventListener('click', () => {
        void (async () => {
          try {
            await activeWindow.navigator.clipboard.writeText(varName);
            new Notice(`Copied ${varName} to clipboard`);
          } catch {
            new Notice(`Failed to copy ${varName} to clipboard`);
          }
        })();
      });
      if (index < vars.length - 1) {
        desc.appendText(', ');
      }
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
