import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleRight, faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss'],
})
export class DashboardCardComponent {
  @Input() title = '';
  @Input() count = 0;
  @Input() icon = faPen;

  readonly faNext = faAngleRight;

  @Output() navigate = new EventEmitter<void>();

  onCardClick(): void {
    this.navigate.emit();
  }
}
