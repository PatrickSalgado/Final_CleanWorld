import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AppContext } from "../../context/AppContext";

const BASE_URL = "https://subattenuated-epithetically-eryn.ngrok-free.dev";

const VOLUME_SIZES = ["Pequeno", "Médio", "Grande", "Muito grande"];
const WASTE_TYPES = ["", "Papel", "Plástico", "Metal", "Vidro", "Orgânico", "Eletrônico", "Madeira", "Entulho", "Outros"];

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
    if (!quantityVolume || Number(quantityVolume) <= 0) return "Quantidade de volumes inválida.";
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

      Alert.alert("Sucesso", `Solicitação criada! Protocolo: #${data.idRegisterOrder ?? data.insertId ?? ""}`);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Falha de conexão com o servidor.");
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Solicitação de Descarte</Text>

      <Text style={styles.label}>Quantidade de Volumes *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 4"
        value={quantityVolume}
        onChangeText={setQuantityVolume}
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Tamanho do Volume *</Text>
      <View style={styles.rowWrap}>
        {VOLUME_SIZES.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, volumeSize === opt && styles.chipActive]}
            onPress={() => setVolumeSize(opt)}
          >
            <Text style={[styles.chipText, volumeSize === opt && styles.chipTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Data da Coleta *</Text>
      <TextInput
        style={styles.input}
        value={collectionDate}
        onChangeText={setCollectionDate}
        placeholder="AAAA-MM-DD"
        onFocus={() => setShowDatePicker(true)}
      />

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
              setCollectionDate(`${y}-${m}-${day}`);
            }
          }}
        />
      )}

      <Text style={styles.label}>Horário da Coleta *</Text>
      <TextInput
        style={styles.input}
        value={collectionTime}
        onChangeText={setCollectionTime}
        placeholder="HH:MM"
        onFocus={() => setShowTimePicker(true)}
      />

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

      <Text style={styles.label}>Endereço *</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Rua, número..." />

      <Text style={styles.label}>Descrição do Material</Text>
      <TextInput
        style={[styles.input, { minHeight: 80 }]}
        value={materialDescription}
        onChangeText={setMaterialDescription}
        multiline
      />

      <Text style={styles.label}>Tipo de Resíduo</Text>
      <View style={styles.rowWrap}>
        {WASTE_TYPES.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, wasteType === opt && styles.chipActive]}
            onPress={() => setWasteType(opt)}
          >
            <Text style={[styles.chipText, wasteType === opt && styles.chipTextActive]}>{opt || "Nenhum"}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar Solicitação</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f0f0f0" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  label: { marginTop: 12, marginBottom: 6, fontSize: 16, fontWeight: "600" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
  },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  chip: {
    backgroundColor: "#ddd",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: "#2e7d32" },
  chipText: { color: "#000" },
  chipTextActive: { color: "#fff" },
  button: {
    backgroundColor: "#2e8b57",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
