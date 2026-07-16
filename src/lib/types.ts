// API DTO tiplari — frontend va backend o'rtasida umumiy.

export type Holat = "REJADA" | "JARAYONDA" | "BAJARILDI";

export interface GoalDTO {
  id: string;
  sarlavha: string;
  tavsif: string | null;
  muddat: string | null;
  progress: number;
  holat: Holat;
  bajarilgan: boolean;
  vazifalarSoni: number;
  bajarilganSoni: number;
}

export interface TaskDTO {
  id: string;
  sarlavha: string;
  tavsif: string | null;
  goalId: string | null;
  goalSarlavha: string | null;
  muddat: string | null;
  muhimlik: number; // 1=past, 2=o'rta, 3=yuqori
  holat: Holat;
  bajarildi: boolean;
}
