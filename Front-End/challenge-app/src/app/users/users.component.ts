import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../_shared/models/user.model';
import { UserService } from '../_shared/services/user.service';
import { AddEditUserComponent } from '../components/add-edit-user/add-edit-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  users: User[] = [];
  currentPage = 0;
  itemsPerPage = 1;
  totalPage = 0;
  
  constructor(
    private modalService: NgbModal, 
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getUsers(this.currentPage, this.itemsPerPage);
  }

  getUsers(skip: number, take: number) {
    this.userService.getUsersWithPagination(skip, take, "Id", "").subscribe({
      next: (data:any) => {
        this.users = data?.items || [];
        this.totalPage = data?.totalPages || 0;
      },
      error: err => {
        console.error(err);
      }
    });
  }

  openAddUserModal() {
    this.openAddEditUserModal([], 'Add');
  }

  editUser(user: any) {
    this.openAddEditUserModal(user, 'Update');
    
  }
  
  deleteUser(userId: string) {
    console.log(userId);
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        // Remove the user from the local array or list
        this.users = this.users.filter(u => u.id !== userId);
  
        this.getUsers(this.currentPage, this.itemsPerPage)
      },
      error: err => {
        console.error('Failed to delete user:', err);
        // Handle error
      }
    });
  }

  openAddEditUserModal(user: any, action: string) {
    const modalRef = this.modalService.open(AddEditUserComponent);
    modalRef.componentInstance.user = user;
    modalRef.componentInstance.action = action;
  }

  get totalPages() {
    return Math.ceil(this.totalPage / this.itemsPerPage);
  }

  get pages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.getUsers(this.currentPage, this.itemsPerPage);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      this.getUsers(this.currentPage, this.itemsPerPage);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getUsers(this.currentPage, this.itemsPerPage);
    }
  }
}
