import { NgModule }            from '@angular/core';
import { RouterModule }        from '@angular/router';

import { GroupComponent }    from './group.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'group/:id', component: GroupComponent }
  ])],
  exports: [RouterModule]
})
export class GroupRoutingModule {}
