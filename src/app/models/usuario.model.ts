export class Usuario{

    static fromFirebase( firestoreUser: any) {
        const user = {...firestoreUser};
       //console.log(`Clase Usuario ${user.uid} ${user.nombre} ${user.email}`);
        return new Usuario( user.uid, user.nombre, user.email );
    }

    constructor(
        public uid: string,
        public nombre: string,
        public email: string
    ){}
}