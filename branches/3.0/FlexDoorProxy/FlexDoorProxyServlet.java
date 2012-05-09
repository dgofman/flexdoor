import java.io.DataInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@SuppressWarnings("serial")
public class FlexDoorProxyServlet extends HttpServlet {

	public void doPost(HttpServletRequest req, HttpServletResponse resp) 
											throws ServletException, IOException 
	{
		doGet(req, resp);
	}

	public void doGet(HttpServletRequest req, HttpServletResponse resp)
											throws ServletException, IOException 
	{
		HttpSession session = req.getSession(true);
		if(session == null)
			return;

		String jsscript = null;
		String filename = req.getParameter("fileName");
		ServletInputStream in = req.getInputStream();
		DataInputStream dis = new DataInputStream(in);
		try{
			jsscript = dis.readUTF();
		}catch(IOException ioe){
			ioe.printStackTrace();
		}
		dis.close();
		in.close();

		@SuppressWarnings("unchecked")
		Map<String, String> scripts = (Map<String, String>)session.getAttribute("jsScripts");
		if(scripts == null)
			scripts = new HashMap<String, String>();

		if(jsscript == null && filename != null && scripts.containsKey(filename)){
			jsscript = scripts.get(filename);
			//scripts.remove(filename);
			byte[] jsBytes = jsscript.getBytes();
			resp.setContentLength(jsBytes.length);
			resp.setContentType("text/javascript");
			resp.setHeader("Content-Disposition", "attachment;filename=" + filename);
			ServletOutputStream stream = resp.getOutputStream();
			stream.write(jsBytes);
			stream.flush();
			stream.close();
			return;
		}

		PrintWriter out = resp.getWriter();
		if(filename != null && jsscript != null){
			scripts.put(filename, jsscript);
			session.setAttribute("jsScripts", scripts);
			out.println("SUCCESS!");
		}else{
			out.println("FILENAME=" + filename + ", SCRIPT=" + jsscript);
		}
		out.close();
	}
}