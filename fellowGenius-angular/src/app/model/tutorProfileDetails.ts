export class tutorProfileDetails {
  public tid: number;
  public fullName: string;
  public institute: string;
  public educationalQualifications: string[] = [];
  public price1: string;
  public price2: string;
  public price3: string;
  public description: string;
  public speciality: string;
  public rating: number;
  public reviewCount: number;
  public lessonCompleted: number;
  public profilePictureUrl: string;
  public professionalSkills: string;
  public currentOrganisation: string;
  public previousOrganisations: string[] = [];
  public areaOfExpertise: expertise[] = [];
  public profileCompleted: number;
  public yearsOfExperience: number;
  public linkedInProfile: string;
}
export class expertise {
  public area: string;
  public price: number;
}
