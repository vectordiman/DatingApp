import {Component, Input, OnInit} from '@angular/core';
import {Member} from "../../_models/member";
import {FileUploader} from "ng2-file-upload";
import {environment} from "../../../environments/environment";
import {AccountService} from "../../_services/account.service";
import {User} from "../../_models/user";
import {take} from "rxjs/operators";
import {FileItem} from "ng2-file-upload/file-upload/file-item.class";
import {ParsedResponseHeaders} from "ng2-file-upload/file-upload/file-uploader.class";
import {MembersService} from "../../_services/members.service";
import {Photo} from "../../_models/photo";

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member!: Member;
  uploader!: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user!: User;

  constructor(private accountService: AccountService, private memberService: MembersService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(event: any) {
    this.hasBaseDropzoneOver = event;
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(p => {
        if (p.isMain) p.isMain = false;
        if (p.id == photo.id) p.isMain = true;
      })
    })
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe(() => {
      this.member.photos = this.member.photos.filter(x => x.id !== photoId);
    })
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    })

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      if(response) {
        const photo = JSON.parse(response);
        this.member.photos.push(photo);
      }
    }
  }
}
