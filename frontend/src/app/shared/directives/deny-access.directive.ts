import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../modules/auth/auth.service';

@Directive({
  selector: '[appDenyAccess]'
})
export class DenyAccessDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) { }

  @Input() set appDenyAccess(roles: number[]) {
    const account = this.authService.accountValue;
    if (account && !roles.includes(<number>account.userInfo.role)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
