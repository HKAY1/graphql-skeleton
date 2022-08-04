'use strict'

module.exports = {
    genders: 'Male|Female'.split('|'),
    userRoles: 'Student|Teacher'.split('|'),
    organisationRoles: 'Admin|Organisation'.split('|'),
    accountStatus: 'Active|Block'.split('|'),
    classes: '1|2|3|4|5|6|7|8|9|10|11|12'.split('|'),
    streams: 'Science|Commerce|Arts'.split('|'),
    subjects: 'Maths|Physics|Chemistry|Biology|English|Computer Science|Science|SST|Hindi'.split('|'),
    teacherEvents: 'Class Test|Debate|Competition|Group Discussion|Extempore'.split('|'),
    adminEvents: 'PTM|Fest|Re-Union'.split('|'),
    images:{
        type: 'User_Profile_Image|Discussion_Image'.split('|'),
    },
    studyMaterials: 'Notes|Assignment|Sample_Paper'.split('|')
}