#ifdef V8_FORMAT

#include "shared.h"
#include "wasm-opcodes-v8.h"
#include "utils-v8.h"

namespace asmjs {

v8::WasmOpcode opcode(I32 i) {
  switch(i) {
    case I32::LitImm: return v8::kExprInt32Const;
    case I32::GetLoc: return v8::kExprGetLocal;
    case I32::GetGlo: return v8::kExprLoadGlobal;
    case I32::SetLoc: return v8::kExprSetLocal;
    case I32::SetGlo: return v8::kExprStoreGlobal;
    // TODO: Load and Store
    case I32::SLoad8:
    case I32::SLoadOff8:
    case I32::ULoad8:
    case I32::ULoadOff8:
    case I32::SLoad16:
    case I32::SLoadOff16:
    case I32::ULoad16:
    case I32::ULoadOff16:
    case I32::Load32:
    case I32::LoadOff32:
    case I32::Store8:
    case I32::StoreOff8:
    case I32::Store16:
    case I32::StoreOff16:
    case I32::Store32:
    case I32::StoreOff32:
      return unreachable<v8::WasmOpcode>();
    case I32::CallInt: return v8::kExprCallFunction;
    case I32::CallInd: return v8::kExprCallIndirect;
    case I32::CallImp: return v8::kExprCallFunction;
    case I32::Cond: return v8::kExprTernary;
    case I32::Comma: return v8::kExprComma;
    case I32::FromF32: return v8::kExprInt32SConvertFloat32;
    case I32::FromF64: return v8::kExprInt32SConvertFloat64;
    case I32::Neg: // Handled elsewhere
      return unreachable<v8::WasmOpcode>();
    case I32::Add: return v8::kExprInt32Add;
    case I32::Sub: return v8::kExprInt32Sub;
    case I32::Mul: return v8::kExprInt32Mul;
    case I32::SDiv: return v8::kExprInt32SDiv;
    case I32::UDiv: return v8::kExprInt32UDiv;
    case I32::SMod: return v8::kExprInt32SRem;
    case I32::UMod: return v8::kExprInt32URem;
    case I32::BitNot: // Handled elsewhere
       return unreachable<v8::WasmOpcode>();
    case I32::BitOr: return v8::kExprInt32Ior;
    case I32::BitAnd: return v8::kExprInt32And;
    case I32::BitXor: return v8::kExprInt32Xor;
    case I32::Lsh: return v8::kExprInt32Shl;
    case I32::ArithRsh: return v8::kExprInt32Sar;
    case I32::LogicRsh: return v8::kExprInt32Shr;
    case I32::Clz: return v8::kExprInt32Clz; // TODO: v8 decoder does not support
    case I32::LogicNot: return v8::kExprBoolNot;
    case I32::EqI32: return v8::kExprInt32Eq;
    case I32::EqF32: return v8::kExprFloat32Eq;
    case I32::EqF64: return v8::kExprFloat64Eq;
    case I32::NEqI32: return v8::kExprInt32Ne;
    case I32::NEqF32: return v8::kExprFloat32Ne;
    case I32::NEqF64: return v8::kExprFloat64Ne;
    case I32::SLeThI32: return v8::kExprInt32Slt;
    case I32::ULeThI32: return v8::kExprInt32Ult;
    case I32::LeThF32: return v8::kExprFloat32Lt;
    case I32::LeThF64: return v8::kExprFloat64Lt;
    case I32::SLeEqI32: return v8::kExprInt32Sle;
    case I32::ULeEqI32: return v8::kExprInt32Ule;
    case I32::LeEqF32: return v8::kExprFloat32Le;
    case I32::LeEqF64: return v8::kExprFloat64Le;
    case I32::SGrThI32: return v8::kExprInt32Sgt;
    case I32::UGrThI32: return v8::kExprInt32Ugt;
    case I32::GrThF32: return v8::kExprFloat32Gt;
    case I32::GrThF64: return v8::kExprFloat64Gt;
    case I32::SGrEqI32: return v8::kExprInt32Sge;
    case I32::UGrEqI32: return v8::kExprInt32Uge;
    case I32::GrEqF32: return v8::kExprFloat32Ge;
    case I32::GrEqF64: return v8::kExprFloat64Ge;
    case I32::SMin: // TODO: v8 decoder does not support
    case I32::UMin: // TODO: v8 decoder does not support
    case I32::SMax: // TODO: v8 decoder does not support
    case I32::UMax: // TODO: v8 decoder does not support
    case I32::Abs: // Handled elsewhere
    default:
      return unreachable<v8::WasmOpcode>();
  }
}

v8::WasmOpcode opcode(F32 f) {
  switch(f) {
    case F32::LitImm: return v8::kExprFloat32Const;
    case F32::GetLoc: return v8::kExprGetLocal;
    case F32::GetGlo: return v8::kExprLoadGlobal;
    case F32::SetLoc: return v8::kExprSetLocal;
    case F32::SetGlo: return v8::kExprStoreGlobal;
    case F32::Load:
    case F32::LoadOff:
    case F32::Store:
    case F32::StoreOff:
      return unreachable<v8::WasmOpcode>();
    case F32::CallInt: return v8::kExprCallFunction;
    case F32::CallInd: return v8::kExprCallIndirect;
    case F32::Cond: return v8::kExprTernary;
    case F32::Comma: return v8::kExprComma;
    case F32::FromS32: return v8::kExprFloat32SConvertInt32;
    case F32::FromU32: return v8::kExprFloat32UConvertInt32;
    case F32::FromF64: return v8::kExprFloat32ConvertFloat64;
    case F32::Neg: return v8::kExprFloat32Neg;
    case F32::Add: return v8::kExprFloat32Add;
    case F32::Sub: return v8::kExprFloat32Sub;
    case F32::Mul: return v8::kExprFloat32Mul;
    case F32::Div: return v8::kExprFloat32Div;
    case F32::Abs: return v8::kExprFloat32Abs;
    case F32::Ceil: return v8::kExprFloat32Ceil; // TODO: v8 decoder does not support
    case F32::Floor: return v8::kExprFloat32Floor; // TODO: v8 decoder does not support
    case F32::Sqrt: return v8::kExprFloat32Sqrt;
    default:
      return unreachable<v8::WasmOpcode>();
  }
}

v8::WasmOpcode opcode(F64 f) {
  switch(f) {
    case F64::LitImm: return v8::kExprFloat64Const;
    case F64::GetLoc: return v8::kExprGetLocal;
    case F64::GetGlo: return v8::kExprLoadGlobal;
    case F64::SetLoc: return v8::kExprSetLocal;
    case F64::SetGlo: return v8::kExprStoreGlobal;
    case F64::Load:
    case F64::LoadOff:
    case F64::Store:
    case F64::StoreOff:
      return unreachable<v8::WasmOpcode>();
    case F64::CallInt: return v8::kExprCallFunction;
    case F64::CallInd: return v8::kExprCallIndirect;
    case F64::CallImp: return v8::kExprCallFunction;
    case F64::Cond: return v8::kExprTernary;
    case F64::Comma: return v8::kExprComma;
    case F64::FromS32: return v8::kExprFloat64SConvertInt32;
    case F64::FromU32: return v8::kExprFloat64UConvertInt32;
    case F64::FromF32: return v8::kExprFloat64ConvertFloat32;
    case F64::Neg: return v8::kExprFloat64Neg;
    case F64::Add: return v8::kExprFloat64Add;
    case F64::Sub: return v8::kExprFloat64Sub;
    case F64::Mul: return v8::kExprFloat64Mul;
    case F64::Div: return v8::kExprFloat64Div;
    case F64::Mod:  // wasm spec and v8 do not support mod
    case F64::Min: return v8::kExprFloat64Min;  // TODO: v8 decoder does not support
    case F64::Max: return v8::kExprFloat64Max; // TODO: v8 decoder does not support
      return unreachable<v8::WasmOpcode>();
    case F64::Abs: return v8::kExprFloat64Abs;
    case F64::Ceil: return v8::kExprFloat64Ceil;  // TODO: v8 decoder does not support
    case F64::Floor: return v8::kExprFloat64Floor;  // TODO: v8 decoder does not support
    case F64::Sqrt: return v8::kExprFloat64Sqrt;
    // wasm spec and v8 do not support these opcode
    case F64::Cos:
    case F64::Sin:
    case F64::Tan:
    case F64::ACos:
    case F64::ASin:
    case F64::ATan:
    case F64::ATan2:
    case F64::Exp:
    case F64::Ln:
    case F64::Pow:
    default:
      return unreachable<v8::WasmOpcode>();
  }
}

v8::WasmOpcode opcode(Void v) {
  switch(v) {
    case Void::CallInt: return v8::kExprCallFunction;
    case Void::CallInd: return v8::kExprCallIndirect;
    case Void::CallImp: return v8::kExprCallFunction;
    default:
      return unreachable<v8::WasmOpcode>();
  }
}

v8::WasmOpcode opcode(const Expr& e) {
  switch(e.type()) {
    case RType::I32: return opcode(e.i32());
    case RType::F32: return opcode(e.f32());
    case RType::F64: return opcode(e.f64());
    case RType::Void: return opcode(e.v());
    default:
      return unreachable<v8::WasmOpcode>();
  }
}

v8::WasmOpcode opcode(I32WithImm imm) {
  switch(imm) {
    case I32WithImm::LitImm: return v8::kExprInt32Const;
    case I32WithImm::GetLoc: return v8::kExprGetLocal;
    default:
      return unreachable<v8::WasmOpcode>();
  }
}

v8::WasmOpcode opcode(F32WithImm fmm) {
  switch(fmm) {
    case F32WithImm::GetLoc: return v8::kExprGetLocal;
    default:
      return unreachable<v8::WasmOpcode>();
  }
}

v8::WasmOpcode opcode(F64WithImm fmm) {
  switch(fmm) {
    case F64WithImm::GetLoc: return v8::kExprGetLocal;
    default:
      return unreachable<v8::WasmOpcode>();
  }
}

v8::WasmOpcode opcode(const ExprWithImm& e) {
  switch(e.type()) {
    case Type::I32: return opcode(e.i32());
    case Type::F32: return opcode(e.f32());
    case Type::F64: return opcode(e.f64());
    default:
      return unreachable<v8::WasmOpcode>();
  }
}

v8::WasmOpcode opcode(const Stmt& s) {
  switch(s) {
    case Stmt::SetLoc: return v8::kExprSetLocal;
    case Stmt::SetGlo: return v8::kExprStoreGlobal;
    case Stmt::I32Store8:
    case Stmt::I32StoreOff8:
    case Stmt::I32Store16:
    case Stmt::I32StoreOff16:
    case Stmt::I32Store32:
    case Stmt::I32StoreOff32:
    case Stmt::F32Store:
    case Stmt::F32StoreOff:
    case Stmt::F64Store:
    case Stmt::F64StoreOff:
      return unreachable<v8::WasmOpcode>();
    case Stmt::CallInt: return v8::kExprCallFunction;
    case Stmt::CallInd: return v8::kExprCallIndirect;
    case Stmt::CallImp: return v8::kExprCallFunction;
    case Stmt::Ret: return v8::kStmtReturn;
    case Stmt::Block: return v8::kStmtBlock;
    case Stmt::IfThen: return v8::kStmtIf;
    case Stmt::IfElse: return v8::kStmtIfThen;
    case Stmt::While:
    case Stmt::Do:
    case Stmt::Label:
      return unreachable<v8::WasmOpcode>();
    case Stmt::Break: return v8::kStmtBreak;
    case Stmt::BreakLabel: return v8::kStmtBreak;
    case Stmt::Continue: return v8::kStmtContinue;
    case Stmt::ContinueLabel: return v8::kStmtContinue;
    case Stmt::Switch:
    default:
      return unreachable<v8::WasmOpcode>();
  }
}

v8::WasmOpcode opcode(const StmtWithImm& s) {
  switch(s) {
    case StmtWithImm::SetLoc: return v8::kExprSetLocal;
    case StmtWithImm::SetGlo: return v8::kExprStoreGlobal;
    default:
      return unreachable<v8::WasmOpcode>();
  }
}

}  // namespace asmjs
#endif
