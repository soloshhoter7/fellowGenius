import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { tutorProfileDetails } from "src/app/model/tutorProfileDetails";
import { HttpService } from "src/app/service/http.service";
import { ProfileService } from "src/app/service/profile.service";
import { StudentService } from "src/app/service/student.service";

@Component({
  selector: "app-experts",
  templateUrl: "./experts.component.html",
  styleUrls: ["./experts.component.css"],
})
export class ExpertsComponent implements OnInit {
  constructor(
    private httpService: HttpService,
    private router: Router,
    private studentService: StudentService
  ) {}
  sid;
  studentProfile;
  searchResults: tutorProfileDetails[] = [];
  ngOnInit(): void {
    if (this.studentService.getStudentProfileDetails().sid != null) {
      this.fetchAllLinkedTutors();
    } else {
      setTimeout(() => {
        this.studentProfile = this.studentService.getStudentProfileDetails();
        this.fetchAllLinkedTutors();
      }, 1000);
    }
  }

  fetchAllLinkedTutors() {
    this.sid = this.studentService.getStudentProfileDetails().sid;
    this.httpService.fetchAllLinkedTutors(this.sid).subscribe((res) => {
      this.searchResults = res;
    });
  }

  viewProfile(profile: tutorProfileDetails) {
    this.router.navigate(["viewTutors"], {
      queryParams: { page: profile.bookingId },
    });
  }
}
