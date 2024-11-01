import {
  Component,
  AfterViewInit,
  Renderer2,
  ElementRef,
  inject,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [RouterLink, BsDropdownModule, RouterOutlet],
  templateUrl: './dashboard-base.component.html',
  styleUrl: './dashboard-base.component.css',
  providers: [{ provide: BsDropdownConfig, useValue: { autoClose: false } }],
})
export class DashboardBaseComponent implements AfterViewInit {
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);

  ngAfterViewInit(): void {
    const sidebarToggle = this.el.nativeElement.querySelector('#sidebarToggle');
    const dashboardBody =
      this.el.nativeElement.querySelector('#dashboard-body');
    if (sidebarToggle) {
      // Check local storage to persist sidebar state across refreshes
      if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        this.renderer.addClass(dashboardBody, 'sb-sidenav-toggled');
      }

      // Add click event to toggle the sidebar
      this.renderer.listen(sidebarToggle, 'click', (event) => {
        event.preventDefault();
        const isToggled =
          dashboardBody.classList.contains('sb-sidenav-toggled');
        if (isToggled) {
          this.renderer.removeClass(dashboardBody, 'sb-sidenav-toggled');
        } else {
          this.renderer.addClass(dashboardBody, 'sb-sidenav-toggled');
        }

        // Store the current sidebar state in local storage
        localStorage.setItem('sb|sidebar-toggle', (!isToggled).toString());
      });
    }
  }
  getUserName() {
    const token = localStorage.getItem('token');
    if (!token) return '';
    const data: any = jwtDecode(token);
    const userName: string = data['userName'];
    return userName;
  }
}
