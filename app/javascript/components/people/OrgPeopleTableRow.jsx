// import React from "react";
// import update from "immutability-helper";
// import DeleteIconButton from "../shared/DeleteIconButton";
// import EditIconButton from "../shared/EditIconButton";
// import { FuzzyDateGroup, TextInputGroup } from "../shared/formGroup";
// import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
// import { Link } from "react-router-dom";

// import dateString from "../../util/dateString";
// import tSub from "../../util/tSub";
// import { fullName } from "../../models/Person";

// class OrgPeopleTableRow extends React.PureComponent {
//   constructor(props) {
//     super(props);
//     const orgPerson = this.props.orgPerson;
//     this.state = {
//       editing: false,
//       invalid: false,
//       position: orgPerson.position,
//       start_date: orgPerson.start_date,
//       end_date: orgPerson.end_date
//     };
//   }

//   edit = () => {
//     this.setState({
//       editing: true,
//       invalid: false
//     });
//   };

//   cancelEdit = () => {
//     this.setState({ editing: false });
//   };

//   setStartDate = date => {
//     this.setState({
//       start_date: date,
//       invalid: false
//     });
//   };

//   setEndDate = date => {
//     this.setState({
//       end_date: date,
//       invalid: false
//     });
//   };

//   handleInput = e => {
//     this.setState({
//       [e.target.name]: e.target.value
//     });
//   };

//   setInvalid = () => {
//     this.setState({ invalid: true });
//   };

//   delete = () => {
//     const person = this.props.person;
//     const orgPerson = this.props.orgPerson;
//     const subs = {
//       org: orgPerson.organization.name,
//       person: fullName(this.props.person)
//     };
//     const message = this.props.t("confirm_delete_org_person");
//     if (window.confirm(message)) {
//       this.props.rawDelete(`/api/organization_people/${orgPerson.id}`, () => {
//         const orgPersonIndex = person.organization_people.findIndex(op => {
//           return op.id == orgPerson.id;
//         });
//         const newPerson = update(person, {
//           organization_people: {
//             $splice: [[orgPersonIndex, 1]]
//           }
//         });
//         this.props.updateModel(newPerson);
//       });
//     }
//   };

//   save = () => {
//     const url = `/api/organization_people/${this.props.orgPerson.id}`;
//     const data = {
//       position: this.state.position,
//       start_date: this.state.start_date,
//       end_date: this.state.end_date
//     };
//     const person = this.props.person;
//     this.props.rawPut(url, data, response => {
//       const newOrgPerson = response.data.organization_person;
//       const orgPersonIndex = person.organization_people.findIndex(op => {
//         return op.id == newOrgPerson.id;
//       });
//       const newPerson = update(person, {
//         organization_people: {
//           $splice: [[orgPersonIndex, 1, newOrgPerson]]
//         }
//       });
//       this.props.updateModel(newPerson);
//     });
//     this.setState({ editing: false });
//   };

//   render() {
//     const orgPerson = this.props.orgPerson;
//     const t = this.props.t;
//     const monthNames = t("month_names_short");
//     const editEnabled = this.props.editEnabled;

//     if (this.state.editing) {
//       return (
//         <tr>
//           <td colSpan="4">
//             <label>{orgPerson.organization.name}</label>
//             <br />
//             <TextInputGroup
//               label={t("Position")}
//               handleInput={this.handleInput}
//               value={this.state.position}
//               name="position"
//             />
//             <FuzzyDateGroup
//               label={t("Start_date")}
//               date={orgPerson.start_date}
//               handleDateInput={this.setStartDate}
//               dateIsInvalid={this.setInvalid}
//               strings={t("date_strings")}
//             />
//             <FuzzyDateGroup
//               label={t("End_date")}
//               date={orgPerson.end_date}
//               handleDateInput={this.setEndDate}
//               dateIsInvalid={this.setInvalid}
//               strings={t("date_strings")}
//               allowBlank
//             />
//             <SmallSaveAndCancel
//               handleSave={this.save}
//               handleCancel={this.cancelEdit}
//               t={t}
//               saveDisabled={this.state.invalid}
//             />
//           </td>
//         </tr>
//       );
//     } else {
//       return (
//         <tr>
//           <td>
//             {/* <button className='btn-link'
//                                 onClick={()=>{this.props.setOrg(orgPerson.organization.id)}}>
//                             {orgPerson.organization.name}
//                         </button> */}
//             <Link to={`/organizations/${orgPerson.organization.id}`}>
//               {orgPerson.organization.name}
//             </Link>
//           </td>
//           <td>
//             {orgPerson.start_date && (
//               <span>
//                 {dateString(orgPerson.start_date, monthNames)}
//                 &nbsp;-&nbsp;
//                 {dateString(orgPerson.end_date, monthNames)}
//               </span>
//             )}
//           </td>
//           <td>{orgPerson.position}</td>
//           {editEnabled && (
//             <td className="rightCol">
//               <EditIconButton handleClick={this.edit} />
//               <DeleteIconButton handleClick={this.delete} />
//             </td>
//           )}
//         </tr>
//       );
//     }
//   }
// }

// export default OrgPeopleTableRow;
