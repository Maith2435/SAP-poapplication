//namespace<Company Name>.<Finance>.<Application NAME>
//namespace samasung.fin.poapp;
namespace poapplication;
// using { poapplication.common as common } from './common';
// using{managed,Currency} from '@sap/cds/common';

// // declare identifier
// // type ![EmployeeName] : String(50);


// // aspect address{
// //     drno : String(20);
// //     street : String(50);
// //     landmark : String(50);
// //     city : String(100);
// //     postal: Integer;
// //     state :String(100);
// //     country :String(100);
// //     region : String(20);
// // }
// entity Students : common.address,common.feeasp,managed{
//     key students : Integer;
//     studentName : common.nameStr;
//     fatherName : common.nameStr;
//     motherName : common.nameStr;
//     contactNo : common.PhoneNumber;
//     email : common.Email;
//     gender : common.gender;
//     // fee : Decimal;
//     currency : Currency ;
//     city : common.nameStr;
//     // country : common.nameStr ;
//     class : Association to one Classes;
//     // mno : Association to many Libraries;
//     book : Association to many Libraries on book.parent = $self;
// }
// entity Classes{
//     key classId : Integer;
//     className : common.nameStr;
//     teacherName : common.nameStr;

// }
// entity Libraries{
//     key bookId : Integer;
//     parent : Association to Students;
//     bookName : String(50);
//     dateofissue : Date;
//     dateofreturn : Date;
//     bookauthor : String(50);
//     available : Boolean ;
// }
    
// /*entity Employees{
//     key empId: Integer;
//     empname : String(50);
//     salary : Integer;
//     dept : String(20);
//     currency : String(20);
//     city : String(50);
//     country : String(50);
//     abc : Association to one Division;
// }*/
// /*entity Division{
//     key divid : Integer;
//     divname : String(50);
//     divcity : String(50);
//     divcountry : String(50);
// }*/
// 
entity Albums {
    key Alb_ID      : Integer;
    Title           : String(120);
    Description     : String(255);
    View            : Integer;
    Photo          : Association to many Photo on Photo.Album = $self;
}
 
entity Location {
    key Location_ID : Integer;
    Name            : String(50);
    Shortname       : String(50);
    Photo          : Association to many Photo on Photo.Location = $self;
}
 
entity Member {
    key Member_ID   : Integer;
    Name            : String(255);
    PhoneNum        : String(20);
    Email           : String(200);
    Address         : String(255);
    Photo          : Association to many Photo on Photo.Member = $self;
}
 
 
entity Photo {
    key Photo_ID    : Integer;
    Album           : Association to Albums;
    Location        : Association to Location;
    Member          : Association to Member;
    Title           : String(120);
    Description     : String(255);
    Privacy         : String(20);
    UploadDate      : Date;
    View            : Integer;
    ImagePath       : String(50);
    Comments        : Association to many Comment on Comments.Photo = $self;
    PhotoTags       : Association to many Tag_Photo on PhotoTags.Photo = $self;
}
 
 
entity Comment {
    key Comment_ID  : Integer;
    Photo           : Association to Photo;
    PostDate        : Date;
    Content         : String(255);
}
 
 
entity Tag {
    key Tag_ID      : Integer;
    Title           : String(120);
    PhotoTags: Association to many Tag_Photo on PhotoTags.Tag = $self;
}
 
 
entity Tag_Photo {
    key ID          : Integer;
    Tag             : Association to Tag;
    Photo           : Association to Photo;
}