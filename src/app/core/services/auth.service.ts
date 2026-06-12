import { Injectable, signal, inject } from '@angular/core';
import { Role, RolesService } from './roles.service';

const LS_ROLE  = 'aptivora.role';
const LS_AUTHED = 'aptivora.authed';

interface AuthState {
  authed: boolean;
  roleId: string;
  role: Role;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private rolesService = inject(RolesService);

  private state = signal<AuthState>({
    authed: false,
    roleId: 'estate-mgr',
    role: this.rolesService.getRole('estate-mgr')
  });

  readonly authState = this.state.asReadonly();

  constructor() {
    this.loadState();
  }

  private loadState() {
    const roleId = localStorage.getItem(LS_ROLE) || 'estate-mgr';
    const authed = localStorage.getItem(LS_AUTHED) === '1';
    
    this.state.set({
      authed,
      roleId,
      role: this.rolesService.getRole(roleId)
    });
  }

  login(roleId: string) {
    localStorage.setItem(LS_ROLE, roleId);
    localStorage.setItem(LS_AUTHED, '1');
    
    this.state.set({
      authed: true,
      roleId,
      role: this.rolesService.getRole(roleId)
    });
  }

  logout() {
    localStorage.setItem(LS_AUTHED, '0');
    localStorage.removeItem(LS_ROLE);
    
    this.state.set({
      authed: false,
      roleId: 'estate-mgr',
      role: this.rolesService.getRole('estate-mgr')
    });
  }

  switchRole(roleId: string) {
    localStorage.setItem(LS_ROLE, roleId);
    
    this.state.update(current => ({
      ...current,
      roleId,
      role: this.rolesService.getRole(roleId)
    }));
  }
}
