import { Component, OnInit } from '@angular/core';
import {User} from "../../_models/user";
import {AdminService} from "../../_services/admin.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {RolesModalComponent} from "../../modals/roles-modal/roles-modal.component";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users!: Partial<User[]>;
  bsModalRef!: BsModalRef;

  constructor(private adminService: AdminService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe(users => {
      this.users = users;
      console.log(this.users);
    })
  }

  openRolesModal() {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        // user,
        // roles: this.getRolesArray(user)
      }
    }
    // this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef = this.modalService.show(RolesModalComponent);
    this.bsModalRef.content.updateSelectedRoles.subscribe((values: any[]) => {
      const rolesToUpdate = {
        roles: [...values.filter(el => el.checked === true).map(el => el.name)]
      };
      // if (rolesToUpdate) {
      //   this.adminService.updateUserRoles(user.username, rolesToUpdate.roles).subscribe(() => {
      //     user.roles = [...rolesToUpdate.roles]
      //   })
      // }
    })
  }

}
