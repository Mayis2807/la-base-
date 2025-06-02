
import java.io.*;
import java.sql.*;

public class enviabbdd {
    public static void main(String[] args) {
        
        try {
            Connection con = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/FeriaValencia", "Practicas", "Practicas");
            File f = new File("suscriptores.csv");
            FileReader fr = new FileReader(f);
            BufferedReader br = new BufferedReader(fr);
            String linea = br.readLine();
            int count = 0;

            while(linea != null){

                String [] datos = linea.split(" ");
                String nombre = datos[0];
		        String apellido = datos[1];
		        String fecha = datos[2];
                String idioma = datos[3];
		        String email = datos[4];

                String sql = "INSERT INTO USUARIO (Nombre, Apellido, Fecha_nacimiento, Idioma, Email) VALUES (?,?,?,?,?)";
                PreparedStatement st = con.prepareStatement(sql);
                st.setString(1, nombre);
                st.setString(2, apellido);
                st.setString(3, fecha);
                st.setString(4, idioma);
		        st.setString(5, email);
                st.executeUpdate();
                count++;
                linea = br.readLine();
            }
            System.out.println("Se agregaron "+ count + " registros correctamente.");
        } catch (Exception e) {
            System.out.println("Excepción: "+e.toString());
        }
    }
}
