import { IServicesRepo, Service } from "@/lib/ports/services.port";

// TODO: Implement Firestore services repository
export const servicesRepoFirebase: IServicesRepo = {
  async list(): Promise<Service[]> {
    // TODO: Implement with Firestore
    // const snapshot = await db.collection('services').where('active', '==', true).get();
    // const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
    // return services.sort((a, b) => {
    //   if (a.order !== undefined && b.order !== undefined) {
    //     return a.order - b.order;
    //   }
    //   return a.name.localeCompare(b.name);
    // });
    throw new Error("Firebase services adapter not implemented yet");
  },
  async create(data: Omit<Service, "id">): Promise<Service> {
    // TODO: return await db.collection('services').add(data)
    throw new Error("Firebase services adapter not implemented yet");
  },
  async update(id: string, data: Partial<Service>): Promise<void> {
    // TODO: await db.collection('services').doc(id).update(data)
    throw new Error("Firebase services adapter not implemented yet");
  },
  async updateAvailability(id: string, available: boolean): Promise<void> {
    // TODO: await db.collection('services').doc(id).update({ available })
    throw new Error("Firebase services adapter not implemented yet");
  },
};