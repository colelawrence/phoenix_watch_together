import { NgModule }            from '@angular/core';
import { RouterModule }        from '@angular/router';

import { GroupIndexComponent }    from './group-index.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'group-index', component: GroupIndexComponent }
  ])],
  exports: [RouterModule]
})
export class GroupRoutingModule {}
