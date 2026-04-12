import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export interface DtEntityCard {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

@Component({
  selector: 'dt-entity-list',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dt-entity-list.component.html',
  styleUrls: ['./dt-entity-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtEntityListComponent {
  @Input({ required: true }) entities: DtEntityCard[] = [];
  @Input() icon?: any;
  @Input() enableOpen = false;

  @Output() open = new EventEmitter<string>();

  @ContentChild('actions') actionsTemplate?: TemplateRef<any>;

  readonly nextIcon = faArrowRight;
}
