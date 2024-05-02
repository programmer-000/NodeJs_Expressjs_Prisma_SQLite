import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllowAccessDirective } from './allow-access.directive';
import { DenyAccessDirective } from './deny-access.directive';

// Directives RBAC
const rbacDirectives = [
  AllowAccessDirective,
  DenyAccessDirective
];

@NgModule({
  declarations: [
    ...rbacDirectives
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ...rbacDirectives
  ]
})
export class DirectivesModule {
}
