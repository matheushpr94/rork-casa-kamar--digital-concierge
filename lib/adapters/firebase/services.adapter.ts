import { IServicesRepo, Service } from "@/lib/ports/services.port";

// TODO: Implement Firestore services repository
export const servicesRepoFirebase: IServicesRepo = {
  async list(): Promise<Service[]> {
    // TODO: return await db.collection('services').where('available', '==', true).get()
    throw new Error("Firebase services adapter not implemented yet");
  },
  async create(data: Omit<Service, "id">): Promise<Service> {
    // TODO: return await db.collection('services').add(data)
    throw new Error("Firebase services adapter not implemented yet");
  },
  async updateAvailability(id: string, available: boolean): Promise<void> {
    // TODO: await db.collection('services').doc(id).update({ available })
    throw new Error("Firebase services adapter not implemented yet");
  },
};