// /src/application/services/GestionMiembroService.ts
import { Miembro } from '../../domain/entities/Miembro';
import { MiembroRepository } from '../../domain/repositories/MiembroRepository';
import { MiembroDTO } from '../dtos/MiembroDTO'; // Asumiendo que existe
import { MiembroFactory } from '../../domain/factories/MiembroFactory'; // Asumiendo que existe

export class GestionMiembroService {

  // El servicio SÓLO conoce el CONTRATO (Principio D)
  constructor(private miembroRepo: MiembroRepository) {} 

  // Se usa un DTO para la entrada de datos
  async registrarMiembro(data: MiembroDTO): Promise<Miembro> {
    // 1. **VALIDACIÓN DE NEGOCIO (Unicidad):**
    // Verifica si ya existe un miembro con ese correo electrónico.
    const miembroExistente = await this.miembroRepo.findByEmail(data.email);
    
    if (miembroExistente) {
        // Lanza un error si la regla de negocio no se cumple
        throw new Error('El correo electrónico ya está registrado como miembro.');
    }
    
    // 2. **CREACIÓN DE LA ENTIDAD (Patrón Factory):**
    // Se delega al Factory la creación de la entidad, asegurando que 
    // se cumplan las reglas de construcción (p. ej., formato del ID, fecha de registro).
    const nuevoMiembro = MiembroFactory.create(data); 

    // 3. **PERSISTENCIA (Patrón Repository):**
    // Llama al CONTRATO para guardar los datos.
    const miembroGuardado = await this.miembroRepo.save(nuevoMiembro);

    // [Opcional - Patrón Observer]: 
    // EventBus.publish('MiembroRegistrado', { id: miembroGuardado.id });
    
    return miembroGuardado; 
  }
  
  // los otros métodos del servicio (obtener, actualizar, eliminar) irían aquí
  async getMiembroById(id: string): Promise<Miembro | null> {
    return this.miembroRepo.findById(id);
  }

  async getAllMiembros(): Promise<Miembro[]> {
    return this.miembroRepo.findAll();
  }

  async updateMiembro(id: string, data: Partial<MiembroDTO>): Promise<Miembro> {
    const miembroExistente = await this.miembroRepo.findById(id);
    if (!miembroExistente) {
      throw new Error('Miembro no encontrado.');
    }

    // Actualiza los campos permitidos
    Object.assign(miembroExistente, data);
    
    return this.miembroRepo.save(miembroExistente);
  }

  async deleteMiembro(id: string): Promise<void> {
    const miembroExistente = await this.miembroRepo.findById(id);
    if (!miembroExistente) {
      throw new Error('Miembro no encontrado.');
    }

    await this.miembroRepo.delete(id);
  }

  async asignarTemploAMiembro(miembroId: string, temploId: string): Promise<Miembro> {
    const miembro = await this.miembroRepo.findById(miembroId);
    if (!miembro) {
      throw new Error('Miembro no encontrado.');
    }

    // Lógica de negocio: asignar el templo al miembro
    miembro.temploId = temploId;

    return this.miembroRepo.save(miembro);
  }
}