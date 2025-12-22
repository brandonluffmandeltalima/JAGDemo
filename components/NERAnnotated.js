import React from 'react';

const NerAnnotatedEmail = () => {
  // Helper component for annotated entities
  const Entity = ({ type, children }) => (
    <span className={`entity entity-${type}`}>
      <span className="entity-label">{type.toUpperCase()}</span>
      {children}
    </span>
  );

  return (
    <div className="email-container">
      <div className="email-content">
        Dear Counsel,
        <br />
        <br />
        This firm represents{' '}
        <Entity type="person">Staff Sergeant Michael A. Reynolds</Entity>,{' '}
        <Entity type="organization">United States Army</Entity>, currently assigned to the{' '}
        <Entity type="organization">82nd Airborne Division, 1st Brigade Combat Team</Entity>, stationed at{' '}
        <Entity type="location">Fort Liberty, North Carolina</Entity>. This correspondence serves as formal notice of representation in connection with{' '}
        <Entity type="case">Case No. 24-MJ-117</Entity>, presently filed in the{' '}
        <Entity type="court">Fort Liberty Military Justice Court</Entity>{' '}
        and arising under the{' '}
        <Entity type="law">Uniform Code of Military Justice</Entity>{' '}
        (<Entity type="law">UCMJ</Entity>).
        <br />
        <br />
        The above-referenced case concerns allegations stemming from events alleged to have occurred on{' '}
        <Entity type="date">14 March 2024</Entity> at or near{' '}
        <Entity type="location">Smoke Bomb Hill Training Area, Fort Liberty, North Carolina</Entity>. As reflected in the charge sheet dated{' '}
        <Entity type="date">22 March 2024</Entity>, Staff Sergeant Reynolds has been charged with{' '}
        <Entity type="law">Article 92, UCMJ</Entity> (Failure to Obey a Lawful Order). My client denies these allegations.
        <br />
        <br />
        This matter is part of an ongoing military justice proceeding, with an 
        <Entity type="hearing">Article 32 preliminary hearing</Entity> currently scheduled for{' '}
        <Entity type="date">10 January 2025</Entity>, to be held at the{' '}
        <Entity type="location">Fort Liberty Legal Services Facility</Entity>, Building 4-2843. The case file includes investigative materials compiled by{' '}
        <Entity type="person">CID Special Agent Laura M. Bennett</Entity>, multiple sworn witness statements, unit policies, and command directives referenced by the Government in support of the charge.
        <br />
        <br />
        Please be advised that the evidence presently contained in the case file both supports and materially contradicts the allegations asserted. Several documents originate from internal unit taskings issued between{' '}
        <Entity type="date">1 February 2024</Entity> and{' '}
        <Entity type="date">12 March 2024</Entity>, including duty rosters, operational emails, and training directives discussed during a command meeting held on{' '}
        <Entity type="date">5 March 2024</Entity> at{' '}
        <Entity type="location">1-82 IN Headquarters, Fort Liberty</Entity>.
        <br />
        <br />
        Accordingly, this letter constitutes a formal demand for preservation of evidence. You and your client are hereby instructed to preserve all documents, reports, communications, electronic records, messages, photographs, videos, and other materials that reference, document, support, or contradict the allegations in this case. This obligation extends to materials in the possession of command staff, investigators, witnesses, and any collaborating units or legal advisors.
        <br />
        <br />
        Please also confirm whether the Government intends to introduce additional motions or supplemental evidence prior to the scheduled hearing. Any failure to disclose or preserve relevant materials may result in appropriate motions for relief, including evidentiary sanctions or dismissal.
        <br />
        <br />
        Nothing contained herein shall be construed as a waiver of any rights, defenses, or appellate remedies available to my client. All such rights are expressly reserved.
        <br />
        <br />
        Kindly direct all future communications regarding this matter to my office.
        <br />
        <br />
        Respectfully,
        <br />
        <br />
        <Entity type="person">John Smith</Entity>
        <br />
        Attorney at Law
        <br />
        Counsel for Staff Sergeant Michael A. Reynolds
        <br />
        <Entity type="location">Fort Liberty, North Carolina</Entity>
      </div>
    </div>
  );
};

export default NerAnnotatedEmail;
