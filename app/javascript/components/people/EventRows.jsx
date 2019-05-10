// import React, { useContext } from "react";
// import eventDateString from "../../util/eventDateString";
// import { Link } from "react-router-dom";
// import { IEvent } from "../../models/Event";
// import I18nContext from "../../contexts/I18nContext";

// interface IProps {
//   events: IEvent[];
// }

// function EventRows(props: IProps) {
//   const events = props.events;
//   const t = useContext(I18nContext);

//   return (
//     <React.Fragment>
//       {events.map(event => {
//         const rowClass = props.pastEvents ? "text-muted" : "";
//         return (
//           <tr key={event.id} className={rowClass}>
//             <td>
//               <Link to={`/events/${event.id}`}>{event.name}</Link>
//             </td>
//             <td>
//               {eventDateString(
//                 event.start_date,
//                 event.end_date,
//                 t("month_names_short")
//               )}
//             </td>
//             <td className="subtle-links">
//               {event.cluster_languages.map((program, index) => {
//                 return (
//                   <React.Fragment key={program.path}>
//                     <Link to={program.path}>{program.name}</Link>
//                     {index < event.cluster_languages.length - 1 && ", "}
//                   </React.Fragment>
//                 );
//               })}
//             </td>
//           </tr>
//         );
//       })}
//     </React.Fragment>
//   );
// }

// export default EventRows;
