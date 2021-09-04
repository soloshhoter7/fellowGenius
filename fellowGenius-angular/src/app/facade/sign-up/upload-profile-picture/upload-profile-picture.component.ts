import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ElementRef,
  Inject,
} from "@angular/core";
import Cropper from "cropperjs";

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
@Component({
  selector: "app-upload-profile-picture",
  templateUrl: "./upload-profile-picture.component.html",
  styleUrls: ["./upload-profile-picture.component.css"],
})
export class UploadProfilePictureComponent implements OnInit {
  @ViewChild("image", { static: false })
  public imageElement: ElementRef;

  public imageSource: string;

  public imageDestination: string;
  profileImage: File;
  private cropper: Cropper;
  constructor(
    private dialogRef: MatDialogRef<UploadProfilePictureComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.imageDestination = "";
    this.imageSource = data.imageSrc;
    this.profileImage = data.image;
  }

  ngOnInit(): void {}
  public ngAfterViewInit() {
    this.cropper = new Cropper(this.imageElement.nativeElement, {
      zoomable: false,
      scalable: false,
      aspectRatio: 1,
      crop: () => {
        const canvas = this.cropper.getCroppedCanvas();
        this.imageDestination = canvas.toDataURL("image/png");
      },
    });
  }

  onUpload() {
    this.dialogRef.close(this.imageDestination);
  }
  closeDialog(){
    this.dialogRef.close(null);
  }
}
