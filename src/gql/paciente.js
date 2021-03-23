import { gql } from "@apollo/client/core";

export const REGISTER = gql`
	mutation registerPaciente($input: PacienteInput) {
		registerPaciente(input: $input) {
			id
			idUser
			name
			email
			createAt
		}
	}
`;

export const GET_PACIENTE = gql`
	query getPaciente($id: ID) {
		getPaciente(id: $id) {
			id
			idUser
			name
			email
			avatar
			nameFamiliar
			telFamiliar
			tel
			consultorio
			motivoConsulta
			description
			edad
			sexo
			fNacimiento
			tipoSangre
			domicilio
			ocupacion
			dr
			password
			createAt
		}
	}
`;

export const UPDATE_PACIENTE = gql`
	mutation updatePaciente($input: PacienteUpdateInput) {
		updatePaciente(input: $input)
	}
`;

export const SEARCH = gql`
	query searchPaciente($search: String) {
		searchPaciente(search: $search) {
			id
			tel
			name
			avatar
		}
	}
`;
