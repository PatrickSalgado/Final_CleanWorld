import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AppContext } from "../../context/AppContext";

const BASE_URL = " https://84975bd346fc.ngrok-free.app";

const VOLUME_SIZES = ["Pequeno", "Médio", "Grande", "Muito grande"];

function toBrazilDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function RegisterOrderScreen({ navigation }) {
  const { idUser } = useContext(AppContext);

  const [quantityVolume, setQuantityVolume] = useState("");
  const [volumeSize, setVolumeSize] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [collectionTime, setCollectionTime] = useState("");
  const [address, setAddress] = useState("");
  const [materialDescription, setMaterialDescription] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [idCollector, setIdCollector] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  function validate() {
    if (!quantityVolume || Number(quantityVolume) <= 0)
      return "Quantidade de volumes inválida.";
    if (!volumeSize) return "Selecione o tamanho do volume.";
    if (!collectionDate) return "Informe a data da coleta.";
    if (!collectionTime) return "Informe o horário da coleta.";
    if (!address || address.trim().length < 5) return "Endereço muito curto.";
    if (!idUser) return "Usuário não autenticado ou idUser inválido.";
    return null;
  }

  async function handleSubmit() {
    const err = validate();
    if (err) {
      Alert.alert("Atenção", err);
      return;
    }

    try {
      const payload = {
        quantityVolume,
        volumeSize,
        collectionDate: toBrazilDate(collectionDate),
        collectionTime,
        address,
        materialDescription,
        wasteType,
        status: 1,
        idUser,
        idCollector,
      };

      const res = await fetch(`${BASE_URL}/api/registerOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Erro", data?.message || "Falha ao enviar solicitação.");
        return;
      }

      Alert.alert(
        "Sucesso",
        `Solicitação criada! Protocolo: #${data.idRegisterOrder ?? data.insertId ?? ""}`
      );
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Falha de conexão com o servidor.");
    }
  }

  return (
  <LinearGradient colors={["#3CB371", "#2E8B57"]} style={styles.container}>
    {/* Header igual ao da outra tela */}
    <View style={styles.header}>
      <Text style={styles.headerText}>♻️ Solicitar Descarte</Text>
      <Text style={styles.subHeaderText}>Informe os dados para agendar a coleta</Text>
    </View>

      <View style={styles.box}>
        <Text style={styles.label}>Quantidade de Volumes *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 4"
          value={quantityVolume}
          onChangeText={setQuantityVolume}
          keyboardType="number-pad"
          placeholderTextColor="#7aa58e"
        />

        <Text style={styles.label}>Tamanho do Volume *</Text>
        <View style={styles.rowWrap}>
          {VOLUME_SIZES.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.chip, volumeSize === opt && styles.chipActive]}
              onPress={() => setVolumeSize(opt)}
            >
              <Text style={[styles.chipText, volumeSize === opt && styles.chipTextActive]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Data da Coleta *</Text>
        <View style={styles.inputIconRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            value={collectionDate}
            onChangeText={setCollectionDate}
            placeholder="DD-MM-AAAA"
            placeholderTextColor="#7aa58e"
            onFocus={() => setShowDatePicker(true)}
          />
          <Ionicons name="calendar-outline" size={22} color="#1b5e20" />
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, d) => {
              setShowDatePicker(false);
              if (d) {
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, "0");
                const day = String(d.getDate()).padStart(2, "0");
                setCollectionDate(`${day}-${m}-${y}`);
              }
            }}
          />
        )}

        <Text style={styles.label}>Horário da Coleta *</Text>
        <View style={styles.inputIconRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            value={collectionTime}
            onChangeText={setCollectionTime}
            placeholder="HH:MM"
            placeholderTextColor="#7aa58e"
            onFocus={() => setShowTimePicker(true)}
          />
          <Ionicons name="time-outline" size={22} color="#1b5e20" />
        </View>

        {showTimePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, t) => {
              setShowTimePicker(false);
              if (t) {
                const hh = String(t.getHours()).padStart(2, "0");
                const mm = String(t.getMinutes()).padStart(2, "0");
                setCollectionTime(`${hh}:${mm}`);
              }
            }}
          />
        )}

        <Text style={styles.label}>Endereço Completo *</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Rua, número, bairro e cidade ..."
          placeholderTextColor="#7aa58e"
        />

        <Text style={styles.label}>Descrição do Material</Text>
        <TextInput
          style={[styles.input, { minHeight: 80, textAlignVertical: "top" }]}
          value={materialDescription}
          onChangeText={setMaterialDescription}
          multiline
          placeholder="Detalhe o material (ex.: caixas de papelão, eletrônicos, etc.)"
          placeholderTextColor="#7aa58e"
        />

        <Text style={styles.label}>Tipo de Resíduo</Text>
        <TextInput
          style={styles.input}
          value={wasteType}
          onChangeText={setWasteType}
          placeholder="Reciclável, Eletrônico, Orgânico, Outros..."
          placeholderTextColor="#7aa58e"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
  </LinearGradient>
);
}

const styles = StyleSheet.create({
  // === Container com gradiente (igual à outra página) ===
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  // === Header central ===
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subHeaderText: {
    fontSize: 14,
    color: "#f1f8e9",
    marginTop: 2,
  },

  // === Card branco (mesma estética do profileBox) ===
  box: {
    backgroundColor: "#ffffffee",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  // === Form ===
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1b5e20",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#e8f5e9",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    color: "#000",
  },

  inputIconRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Chips (mantidos, mas com cores compatíveis)
  rowWrap: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    backgroundColor: "#d7efe4",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#cfe8db",
  },
  chipActive: { backgroundColor: "#1b5e20" },
  chipText: { color: "#184e36", fontWeight: "600" },
  chipTextActive: { color: "#fff", fontWeight: "700" },

  // Botão igual ao da outra tela
  saveButton: {
    backgroundColor: "#43a047",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
